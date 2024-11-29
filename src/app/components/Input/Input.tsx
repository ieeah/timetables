"use client";

import React from "react";
import "./input.scss";
import Password from "./Password/Password";
import { InputProps, InputTypes } from "./types";

function Input({ className, ...props }: InputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={`input-wrapper ${className || ""}`}>
      <div className="input">
        <InputLabel id={props.id} required={props.required}>
          {props.label}
        </InputLabel>
        <input
          ref={inputRef}
          {...props}
        />
      </div>
    </div>
  );
}

function InputLabel({
  children,
  required = false,
  id,
}: Readonly<{
  children: React.ReactNode;
  required?: boolean;
  id?: string;
}>) {
  return (
    <label htmlFor={id}>
      {children}
      {required && <span className="required-indicator">*</span>}
    </label>
  );
}

export function BasicInput({ className, ...props }: InputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={`input-wrapper ${className || ""}`}>
      <div className="input">
        <InputLabel id={props.id} required={props.required}>
          {props.label}
        </InputLabel>
        <input
          ref={inputRef}
          {...props}
        />
      </div>
    </div>
  );
}

const inputMap: Record<InputTypes, React.ComponentType<any>> = {
  password: Password,
  text: BasicInput,
  email: BasicInput,
};

function DispatchInput({ type, ...props }: InputProps) {
  const InputComponent = inputMap[type] ?? BasicInput;
  return <InputComponent type={type} {...props} />;
}

Input.displayName = "Input";
export default DispatchInput;
