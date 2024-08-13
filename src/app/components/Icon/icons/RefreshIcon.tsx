import { IconProps, IconColors, IconThickness, IconSizes } from "../types";

export default function RefreshIcon({ ...props }: Readonly<IconProps>) {
  return (
    <svg
      width={IconSizes[props.size]}
      height={IconSizes[props.size]}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 2C16.8307 2.00005 19.5703 3.0008 21.7346 4.8254C23.8988 6.64999 25.3484 9.18094 25.827 11.9709C26.3057 14.7609 25.7826 17.6303 24.3503 20.0719C22.9179 22.5135 20.6686 24.3702 17.9997 25.3137C15.3309 26.2573 12.4144 26.227 9.76569 25.2282C7.11702 24.2294 4.90671 22.3264 3.52542 19.8555C2.14413 17.3847 1.6808 14.505 2.21731 11.7256C2.75383 8.94618 4.25565 6.4459 6.45734 4.66667"
        stroke={IconColors[props.color]}
        strokeWidth={IconThickness[props.thickness]}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 4H7.33333V9.33333"
        stroke={IconColors[props.color]}
        strokeWidth={IconThickness[props.thickness]}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
