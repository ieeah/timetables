import { IconProps, IconColors, IconThickness, IconSizes } from "../types";

export default function KebabIcon({ size = "md", color = "default", thickness = "bold", ...props }: Readonly<IconProps>) {
  if (thickness !== "bold")
    console.warn(
      "L'icona 'kebab' può avere solo 'bold' come valore di thickness, è stato quindi reimpostato automaticamente",
    );

  return (
    <svg
      width={IconSizes[size]}
      height={IconSizes[size]}
      viewBox="0 0 6 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 12H3.01333V12.0133H3V12ZM3 2.66663H3.01333V2.67996H3V2.66663ZM3 21.3333H3.01333V21.3466H3V21.3333Z"
        stroke={IconColors[color]}
        strokeWidth={IconThickness["bold"]}
        strokeLinejoin="round"
      />
    </svg>
  );
}
