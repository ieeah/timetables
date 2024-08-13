import { IconProps, IconColors, IconThickness, IconSizes } from "../types";

export default function TogglesIcon({ ...props }: Readonly<IconProps>) {
  return (
    <svg
      width={IconSizes[props.size]}
      height={IconSizes[props.size]}
      viewBox="0 0 26 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.33333 4.66663H14.3333M19.6667 4.66663H23.6667M11.6667 15.3333H23.6667M2.33333 15.3333H6.33333"
        stroke={IconColors[props.color]}
        strokeWidth={IconThickness[props.thickness]}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.99999 18C10.4728 18 11.6667 16.8061 11.6667 15.3333C11.6667 13.8605 10.4728 12.6666 8.99999 12.6666C7.52724 12.6666 6.33333 13.8605 6.33333 15.3333C6.33333 16.8061 7.52724 18 8.99999 18Z"
        stroke={IconColors[props.color]}
        strokeWidth={IconThickness[props.thickness]}
      />
      <path
        d="M17 7.33333C18.4728 7.33333 19.6667 6.13943 19.6667 4.66667C19.6667 3.19391 18.4728 2 17 2C15.5272 2 14.3333 3.19391 14.3333 4.66667C14.3333 6.13943 15.5272 7.33333 17 7.33333Z"
        stroke={IconColors[props.color]}
        strokeWidth={IconThickness[props.thickness]}
      />
    </svg>
  );
}
