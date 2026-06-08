import {
  IconProps,
  IconColors,
  IconThickness,
  IconSizes,
  ChevronSides,
} from "../types";

export default function ChevronIcon({ size = "md", color = "default", thickness = "bold", ...props }: Readonly<IconProps>) {
  const side: ChevronSides = props.icon.split("-")[1] as ChevronSides;
  const rotation = {
    right: "unset",
    bottom: "90deg",
    left: "180deg",
    top: "-90deg",
  };
  const base = (
    <svg
      width={IconSizes[size]}
      height={IconSizes[size]}
      viewBox="0 0 11 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ rotate: rotation[side] }}
    >
      <path
        d="M2.33334 15.6667L9 9.00004L2.33334 2.33337"
        stroke={IconColors[color]}
        strokeWidth={IconThickness[thickness]}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return base;
}
