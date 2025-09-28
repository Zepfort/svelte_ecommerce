import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const emailRaw = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const email = emailRaw.trim().toLowerCase();
    const pwd = password;

    if (!email || !pwd) {
      return fail(400, { success: false, errors: ["Email dan password dibutuhkan"], email, password: "" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pwd });

    if (error) {
      console.error("Supabase signIn error:", error);
      return fail(400, { success: false, errors: [error.message ?? "Login gagal"] });
    }

    // login berhasil → user ada di `data.user`
    // Ambil kolom `role` dari tabel public.users
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

      // fallback profil error
    if (profileError) {
      console.error("Error mengambil profile:", profileError);
      throw redirect(303, "/");
    }

    const userRole = profile.role;

    if (userRole === "admin") {
      throw redirect(303, "/admin/dashboard");
    } else {
      throw redirect(303, "/");
    }
  }
};
