import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const { supabase, safeGetSession } = locals;

  // Jika ada parameter `code`, tukar menjadi session (OAuth / PKCE flow)
  const code = url.searchParams.get('code');
  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
      throw redirect(303, url.pathname);
    } catch (err) {
      console.error("Error saat exchangeCodeForSession:", err);
    }
  }

  const { session } = await safeGetSession();
  const user = session?.user ?? null

  let userProfile = null;

  if (session && user) {
    const { data: profile, error } = await supabase
  .from('users')
  .select('id, name, email, role')
  .eq('id', user.id)
  .single();
    // console.log('Auth user.id:', user.id);
    // console.log('UserProfile query result:', profile, error);

    if (error) {
      console.error("Error mengambil profile:", error);
    } else {
      userProfile = profile;
    }
  }

  
  return {
    session,
    user,
    userProfile
  };
};
