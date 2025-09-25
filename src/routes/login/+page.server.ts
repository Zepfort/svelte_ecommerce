import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      return fail(400, { success: false, errors: ["Email dan password dibutuhkan"], email, password });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Supabase signIn error:", error);
      return fail(400, { success: false, errors: [error.message ?? "Login gagal"] });
    }

    throw redirect(303, "/");
  }

  
};
