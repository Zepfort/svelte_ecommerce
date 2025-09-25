// // import type { Actions } from "./$types"
// // import { createClient } from "@supabase/supabase-js";
// // import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
// import { fail, redirect } from "@sveltejs/kit";


// interface ReturnObject {
//     success: boolean;
//     name: string;
//     email: string;
//     password: string;
//     passwordConfirmation: string;
//     errors: string[]
// }

// export const actions = {
//     default: async ({request, locals: {supabase}}) => {
//         const formData = await request.formData();
        
//         const name = formData.get("name") as string;
//         const email = formData.get("email") as string;
//         const password = formData.get("password") as string;
//         const passwordConfirmation = formData.get("passwordConfirmation") as string;

//         const returnObject : ReturnObject = {
//             success: true,
//             name,
//             email,
//             password,
//             passwordConfirmation,
//             errors: [],
//         }

//         if (name.length < 2) {
//             returnObject.errors.push(
//                 "Nama harus lebih dari tiga karakter."
//             );
//         }

//         if (!email.length) {
//             returnObject.errors.push(
//                 "Email dibutuhkan"
//             )
//         }

//         if (!password.length) {
//             returnObject.errors.push(
//                 "Password dibutuhkan"
//             )
//         }
        
//         if (password !== passwordConfirmation) {
//             returnObject.errors.push(
//                 "Password tidak sama"
//             )
//         }

//         if (returnObject.errors.length) {
//             returnObject.success = false;
//             return returnObject;
//         }

//         //registration flow
        
//         const { data, error } = await supabase.auth.signUp({
//             email,
//             password,
//         });

//         if (error || !data.user) {
//             console.log("error");
//             console.log(error);
//             returnObject.success = false;
//             return fail(400, returnObject )
//         } 

//         throw redirect(303, "/")

//         return returnObject;        
//     }
// }