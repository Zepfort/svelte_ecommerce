import { fail, redirect } from "@sveltejs/kit";

interface ReturnObject {
  success: boolean;
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  errors: string[];
}

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();

    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const passwordConfirmation = String(formData.get("passwordConfirmation") ?? "");

    const returnObject: ReturnObject = {
      success: true,
      name,
      email,
      password,
      passwordConfirmation,
      errors: [],
    };

    if (name.length < 2) returnObject.errors.push("Nama harus lebih dari tiga karakter.");
    if (!email.length) returnObject.errors.push("Email dibutuhkan");
    if (!password.length) returnObject.errors.push("Password dibutuhkan");
    if (password !== passwordConfirmation) returnObject.errors.push("Password tidak sama");

    if (returnObject.errors.length) {
      returnObject.success = false;
      return fail(400, returnObject);
    }

    // registration flow
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data : { name: name}
      }
    });

    if (error) {
      console.error("Supabase signUp error:", error);
      returnObject.success = false;
      return fail(400, { ...returnObject, errors: [error.message ?? "Registrasi gagal"] });
    }
    throw redirect(303, "/login");
  },
};
