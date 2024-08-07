import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
);
// import { useRouter } from "next/navigation";
// import { supabase } from "./supabaseClient";

//   const handleLogin = async () => {
//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });
//       if (error) {s
//         console.log(error.message);
//       } else {
//         router.push("/");
//       }
//     } catch (error) {
//       console.error((error as Error).message);
//     }
//   };

//   const handleSignUp = async () => {
//     try {
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//       });
//       if (error) {
//         console.error(error.message);
//       } else {
//         router.push("/");
//       }
//     } catch (error) {
//       console.error((error as Error).message);
//     }
//   };
