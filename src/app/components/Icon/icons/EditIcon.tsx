import { IconProps, IconColors, IconThickness, IconSizes } from "../types";

export default function EditIcon({ ...props }: Readonly<IconProps>) {
  return (
    <svg
      width={IconSizes[props.size]}
      height={IconSizes[props.size]}
      viewBox="0 0 26 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.66667 18.3334L1.33333 23.6667L6.66667 22.3334L22.1147 6.88538C22.6146 6.3853 22.8954 5.70715 22.8954 5.00004C22.8954 4.29294 22.6146 3.61479 22.1147 3.11471L21.8853 2.88538C21.3853 2.38546 20.7071 2.10461 20 2.10461C19.2929 2.10461 18.6147 2.38546 18.1147 2.88538L2.66667 18.3334Z"
        stroke={IconColors[props.color]}
        strokeWidth={IconThickness[props.thickness]}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.66667 18.3333L1.33333 23.6667L6.66667 22.3333L20 9L16 5L2.66667 18.3333Z"
        fill={IconColors[props.color]}
      />
      <path
        d="M16 5L20 9M13.3333 23.6667H24"
        stroke={IconColors[props.color]}
        strokeWidth={IconThickness[props.thickness]}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}