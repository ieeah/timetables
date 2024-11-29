"use client";

import React from "react";
import { Icon } from "../../../Icon/Icon";
import { BasicInput } from "../../Input";
import { InputProps } from "../../types";

export default function Password(props: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const overrideType = showPassword ? "text" : "password";

  return (
    <div
      className="password-input-wrapper"
      style={{
        position: "relative",
        width: "100%"
      }}
    >
      <BasicInput {...props} type={overrideType} />
      <button
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
        onClick={() => setShowPassword(!showPassword)}
        type="button"
        aria-label={showPassword ? "Nascondi password" : "Mostra password"}
        aria-pressed={showPassword}
      >
        <Icon icon={showPassword ? "eye-off" : "eye-on"} size="sm" />
      </button>
    </div>
  );
}
