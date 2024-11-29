import { IconProps, IconColors, IconThickness, IconSizes } from "../types";

export default function KebabIcon({ ...props }: Readonly<IconProps>) {
  if (props.thickness !== "bold")
    console.warn(
      "L'icona 'kebab' può avere solo 'bold' come valore di thickness, è stato quindi reimpostato automaticamente",
    );

  return (
    <svg
      width={IconSizes[props.size]}
      height={IconSizes[props.size]}
      viewBox="0 0 6 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 12H3.01333V12.0133H3V12ZM3 2.66663H3.01333V2.67996H3V2.66663ZM3 21.3333H3.01333V21.3466H3V21.3333Z"
        stroke={IconColors[props.color]}
        strokeWidth={IconThickness["bold"]}
        strokeLinejoin="round"
      />
    </svg>
  );
}
