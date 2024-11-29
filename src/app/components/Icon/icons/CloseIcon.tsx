import { IconProps, IconColors, IconThickness, IconSizes } from "../types";

export default function CloseIcon({ ...props }: Readonly<IconProps>) {
  return (
    <svg
      width={IconSizes[props.size ?? "md"]}
      height={IconSizes[props.size ?? "md"]}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.33333 2.33337L15.6667 15.6667M2.33333 15.6667L15.6667 2.33337"
        stroke={IconColors[props.color ?? "default"]}
        strokeWidth={IconThickness[props.thickness ?? "bold"]}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
