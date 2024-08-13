import { IconProps, IconColors, IconSizes } from "../types";

export default function ClockIcon({ ...props }: Readonly<IconProps>) {
  return (
    <svg
      width={IconSizes[props.size ?? "md"]}
      height={IconSizes[props.size ?? "md"]}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill={IconColors[props.color ?? "default"]}
        d="M17 3.34A10 10 0 1 1 2 12l.005-.324A10 10 0 0 1 17 3.34M12 6a1 1 0 0 0-1 1v5.026l.009.105l.02.107l.04.129l.048.102l.046.078l.042.06l.069.08l.088.083l.083.062l3 2a1 1 0 1 0 1.11-1.664L13 11.464V7a1 1 0 0 0-.883-.993z"
      ></path>
    </svg>
  );
}