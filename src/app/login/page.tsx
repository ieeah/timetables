"use client";

import { useRouter } from "next/navigation";
import React from "react";

import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

import { supabaseAuth } from "../../../supabaseClient";

import "./login.scss";

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
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.name === "email") setEmail(value);
    if (e.target.name === "pwd") setPassword(value);
  };

  const handleLogin = async () => {
    const [error, data] = await supabaseAuth.login({ email, password });
    console.log("Login response:", { error, data });
  };

  const handleSignUp = async () => {
    const [error, data] = await supabaseAuth.signUp({ email, password });
    console.log("Sign up response:", { error, data });
  };

  const handleSubmit = async (action: string) => {
    if (action === "login") {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    <main className="main">
      <form className="login-box" onSubmit={(e) => e.preventDefault()}>
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
        <div className="actions-wrapper">
          <Button
            className="mb-1"
            variant="primary"
            onClick={() => handleSubmit("login")}
            type="submit"
          >
            Accedi
          </Button>
          <Button onClick={() => handleSubmit("signup")}>Registrati</Button>
        </div>
      </form>
    </main>
  );
}
