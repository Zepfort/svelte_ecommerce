// src/routes/profile/+page.server.ts
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, parent }) => {
  // ambil userProfile dari parent layout (layout.server.ts)
  const parentData = await parent();
  const userProfile = parentData.userProfile;

  if (!userProfile) {
    // jika tidak ada session / user (seharusnya sudah dicek di layout), redirect
    throw redirect(303, '/login');
  }

  // fetch addresses dari database (sama seperti di +page.server.ts / +page untuk alamat)
  const { data: addresses, error } = await locals.supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userProfile.id)
    .order('is_default', { ascending: false });

  if (error) {
    console.error('Gagal memuat alamat di profile page:', error);
    // Kamu bisa lempar error, atau fallback ke array kosong
    return {
      userProfile,
      addresses: []
    };
  }
  console.log('profile load', { userProfile, addresses });
  return {
    userProfile,
    addresses: addresses ?? []
  };
};
