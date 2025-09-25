// interface ReturnObject {
//     success: boolean;
//     email: string;
//     password: string;
//     passwordConfirmation?: never;
//     name?: never;
//     errors: string[]
// }

// // import { createClient } from '@supabase/supabase-js';
// import { fail, redirect } from '@sveltejs/kit';

// // const supabaseUrl = process.env.SUPABASE_URL as string;
// // const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
// // const supabase = createClient(supabaseUrl, supabaseKey);

// export const actions = {
//     default: async ({request, locals: {supabase}}) => {
//         const formData = await request.formData();
        
//         const email = formData.get("email") as string;
//         const password = formData.get("password") as string;

//         const returnObject : ReturnObject = {
//             success: true,
//             email,
//             password,
//             errors: [],
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
        
//         const { data, error } = await supabase.auth.signInWithPassword({
//             email,
//             password
//         })

//         if (error || !data.user ) {
//             console.log("Error di sini")
//             console.log(error)
//             returnObject.success = false;
//             return fail(400, returnObject )
//         }

//         // if (returnObject.errors.length) {
//         //     returnObject.success = false;
//         //     return returnObject;
//         // }

        
//         throw redirect(303, "/")
//         // return returnObject;        
//     }
// }