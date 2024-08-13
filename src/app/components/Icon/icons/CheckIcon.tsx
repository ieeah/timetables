import { IconProps, IconColors, IconThickness, IconSizes } from "../types";

export default function CheckIcon({ ...props }: Readonly<IconProps>) {
  return (
    <svg
      width={IconSizes[props.size ?? "md"]}
      height={IconSizes[props.size ?? "md"]}
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.6667 2.33337L8.33333 15.6667L1.66666 9.00004"
        stroke={IconColors[props.color ?? "default"]}
        strokeWidth={IconThickness[props.thickness ?? "bold"]}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
