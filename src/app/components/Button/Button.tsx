"use client"
import cn from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

import "./button.scss";

export default function Button({
  children,
  className,
  variant = "secondary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {

  const buttonClassname = cn("button", className, {
    [`${variant}`]: variant,
  });

  return (
      <button className={buttonClassname} {...props}>{children}</button>
  )
}