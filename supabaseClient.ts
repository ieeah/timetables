import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
);
// import { useRouter } from "next/navigation";
// import { supabase } from "./supabaseClient";
// import { Session, User } from "@supabase/supabase-js";

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

//   const getSession = async () => {
//     const session: Session | null = await supabase.auth.getSession();
//     // const authUser: User | null = await supabase.auth.updateUser({
//     //   data: {
//     //     full_name: "test user",
//     //   },
//     // });
//     if (session?.data?.session?.user) {
//       setUser(session.data?.session?.user);
//     } else {
//       router.push("/login");
//     }
//   };

// const signOut = async () => {
//   supabase.auth.signOut().then(() => router.push("/login"));
// }

// <div>Welcome, {user.user_metadata.full_name}</div>
