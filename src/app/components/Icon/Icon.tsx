import React, { SVGProps } from "react";
import DispatchIcon from "./Icons";
import { IconProps } from "./types";

function Icon({
  size = "md",
  thickness = "bold",
  color = "default",
  icon,
  ...props
}: Readonly<IconProps & Omit<SVGProps<SVGSVGElement>, "stroke" | "size">>) {
  return (
    <DispatchIcon
      size={size}
      thickness={thickness}
      color={color}
      icon={icon}
      {...props}
    />
  );
}

Icon.displayName = "Icona";

export { Icon };
