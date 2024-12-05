"use client"
import cn from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

import "./button.scss";

export default function Button({
  children,
  className,
  variant = "secondary",
  block = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
  block?: boolean;
}) {

  const buttonClassname = cn("btn", className, {
    [`${variant}`]: variant,
    block,
  });

  return (
      <button className={buttonClassname} {...props}>{children}</button>
  )
}