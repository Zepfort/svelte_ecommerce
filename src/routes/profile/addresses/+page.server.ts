// src/routes/account/address/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const { session, user } = locals;
  if (!session || !user) throw redirect(303, '/login');

  // langsung baca dari addresses
  const { data: addresses, error } = await locals.supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false });

  if (error) {
    console.error('fetch addresses:', error);
    return fail(500, { error: 'Gagal memuat alamat' });
  }

  return { addresses: addresses ?? [] };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { user } = locals;
    if (!user) throw redirect(303, '/login');

    const form = await request.formData();
    const id = form.get('id')?.toString();      // <── id alamat (kosong = baru)

    const phoneRaw = form.get('nomor')?.toString() ?? '';
    const digits = phoneRaw.replace(/\D/g, '');
    if (digits.length < 12) {
      return fail(400, { phoneError: 'Nomor telepon minimal 12 digit' });
    }

    const payload = {
      recipient: form.get('penerima')?.toString().trim() || null,
      phone: digits,
      label: form.get('label')?.toString().trim() || 'Rumah',
      full_address: form.get('alamat_jalan')?.toString().trim() || null,
      province: form.get('provinsi')?.toString().trim() || null,
      city: form.get('kabupaten_kota')?.toString().trim() || null,
      district: form.get('kecamatan')?.toString().trim() || null,
      village: form.get('desa_kelurahan')?.toString().trim() || null,
      postal_code: form.get('kode_pos')?.toString().trim() || null
    };

    if (id) {
      // UPDATE
      const { error } = await locals.supabase
        .from('addresses')
        .update(payload)
        .eq('id', id)
        .eq('user_id', user.id);     // pastikan milik user

      if (error) return fail(500, { error: 'Gagal memperbarui alamat' });
    } else {
      // INSERT baru
      const { count } = await locals.supabase
        .from('addresses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const ins = {
        ...payload,
        user_id: user.id,
        is_default: !count
      };

      const { error } = await locals.supabase.from('addresses').insert(ins);
      if (error) return fail(500, { error: 'Gagal menyimpan alamat' });
    }

    throw redirect(303, '/profile/account');
  }
};