import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

// src/routes/profile/account/+page.server.ts
export const load: PageServerLoad = async ({ locals }) => {
  const { session, user } = locals;
  if (!session || !user) throw redirect(303, '/login');

  // ambil profil user (name, email, created_at)
  const { data: userProfile, error: userError } = await locals.supabase
    .from('users')
    .select('id, name, email, created_at')
    .eq('id', user.id)
    .single();

  if (userError) {
    console.error('fetch user:', userError);
    return fail(500, { error: 'Gagal memuat profil' });
  }

  // ambil SEMUA alamat user (bisa >1) + tandai default
  const { data: addresses, error: addrError } = await locals.supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false });

  if (addrError) {
    console.error('fetch addresses:', addrError);
  }

  return {
    userProfile,
    addresses: addresses ?? [] // bisa 0, 1, atau banyak
  };
};

export const actions: Actions = {
  delete: async ({locals}) => {
    const {user} = locals;

    const { error } = await locals.supabase
      .from('users')
      .update({
        provinsi: null,
        kabupaten_kota: null,
        kecamatan: null,
        desa_kelurahan: null,
        alamat_jalan: null,
        kode_pos: null
      })
      .eq('id', user?.id);

      if (error) {
        console.log('Error deleting address:', error);
        return { success: false, message: 'Gagal menghapus alamat' };
      }
      throw redirect(303,'/profile');
  }
}
