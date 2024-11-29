"use client";

import React from "react";
// import { supabase } from "../../../supabaseClient";
// import { useRouter } from "next/navigation";
// // import styles from "./login.module.css";
// // import styles from "../src/app/style/global.module.css";
import { Icon } from "../components/Icon/Icon";
import Input from "../components/Input/Input";
import "./login.scss";

// export default function Page() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleLogin = async () => {
//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });
//       if (error) {
//         alert(error.message);
//       } else {
//         router.push("/");
//       }
//     } catch (error) {
//       alert((error as Error).message);
//     }
//   };

//   const handleSignUp = async () => {
//     try {
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//       });
//       if (error) {
//         alert(error.message);
//       } else {
//         router.push("/");
//       }
//     } catch (error) {
//       alert((error as Error).message);
//     }
//   };

//   const handleSubmit = async (action: string) => {
//     if (action === "login") {
//       handleLogin();
//     } else {
//       handleSignUp();
//     }
//   };

//   return (
//     <div>
//       <h1>Timetables</h1>
//     </div>
//   );
// }

const arr: Array<"xs" | "sm" | "md" | "lg" | "xl"> = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
];

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.name === "email") setEmail(value);
    if (e.target.name === "pwd") setPassword(value);
  };

  return (
    <main className="main">
      <div className="login-box">
        <h2>Login</h2>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={handleChange}
          name="email"
          className="mb-2"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={handleChange}
          name="pwd"
          required
        />
        <div className="login-divider"></div>
      </div>
    </main>
  );
}
