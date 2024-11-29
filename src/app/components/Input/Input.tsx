"use client";

import cn from "classnames";
import React from "react";

import Password from "./Password/Password";
import "./input.scss";
import { InputProps, InputTypes } from "./types";

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

export function BasicInput({
  className,
  label,
  id,
  required,
  ...props
}: InputProps) {

  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputClassName = cn(
    "input-wrapper",
    { "input--disabled": props.disabled },
    className
  );
  
  return (
    <div className={inputClassName}>
      <div className="input">
        <InputLabel id={id} required={required}>
          {label}
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

BasicInput.displayName = "Input";
export default DispatchInput;
