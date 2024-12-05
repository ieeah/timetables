"use client";

import { useRouter } from "next/navigation";
import React from "react";

import Button from "../Button/Button";
import Input from "../Input/Input";

import { supabaseAuth } from "../../../../supabaseClient";
import "./login.scss";

export default function LoginBox() {
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

  const handleLogout = async () => {
    const [error, data] = await supabaseAuth.signOut();
    console.log("Logout response:", { error, data });
  };

  const handleSubmit = async (action: string) => {
    if (action === "login") {
      handleLogin();
    } else if (action === "signup") {
      handleSignUp();
    } else {
      handleLogout();
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-box" onSubmit={(e) => e.preventDefault()}>
        <h3 className="mb-15">Login</h3>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={handleChange}
          name="email"
          className="mb-2"
          required
          placeholder=""
          aria-placeholder="Email"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={handleChange}
          name="pwd"
          required
          placeholder=""
          aria-placeholder="Password"
          minLength={8}
        />
        <div className="login-divider"></div>
        <div className="actions-wrapper">
          <Button
            variant="primary"
            onClick={() => handleSubmit("login")}
            type="submit"
            block
          >
            Accedi
          </Button>
          <Button
            onClick={() => handleSubmit("signup")}
            block
            type="submit"
          >
            Registrati
          </Button>
          <Button
            onClick={() => handleSubmit("logout")}
            block
            type="submit"
          >
            Esci
          </Button>
        </div>
      </form>
    </div>
  );
}
