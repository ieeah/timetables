import { IconProps, IconColors, IconSizes } from "../types";

export default function DeleteIcon({ ...props }: Readonly<IconProps>) {
  return (
    <svg
      width={IconSizes[props.size]}
      height={IconSizes[props.size]}
      viewBox="0 0 24 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.808 1.40396C6.91865 1.18252 7.08877 0.996255 7.2993 0.866029C7.50983 0.735803 7.75245 0.666758 8 0.666626H16C16.2475 0.666758 16.4902 0.735803 16.7007 0.866029C16.9112 0.996255 17.0813 1.18252 17.192 1.40396L19.4907 5.99996H22.6667C23.0203 5.99996 23.3594 6.14044 23.6095 6.39048C23.8595 6.64053 24 6.97967 24 7.33329C24 7.68691 23.8595 8.02605 23.6095 8.2761C23.3594 8.52615 23.0203 8.66663 22.6667 8.66663H21.3333V23.3333C21.3333 24.3942 20.9119 25.4116 20.1618 26.1617C19.4116 26.9119 18.3942 27.3333 17.3333 27.3333H6.66667C5.6058 27.3333 4.58839 26.9119 3.83824 26.1617C3.08809 25.4116 2.66667 24.3942 2.66667 23.3333V8.66663H1.33333C0.979711 8.66663 0.640573 8.52615 0.390524 8.2761C0.140476 8.02605 0 7.68691 0 7.33329C0 6.97967 0.140476 6.64053 0.390524 6.39048C0.640573 6.14044 0.979711 5.99996 1.33333 5.99996H4.50933L6.808 1.40396ZM15.176 3.33329L16.5093 5.99996H7.49067L8.824 3.33329H15.176ZM10.6667 12.6666C10.6667 12.313 10.5262 11.9739 10.2761 11.7238C10.0261 11.4738 9.68696 11.3333 9.33333 11.3333C8.97971 11.3333 8.64057 11.4738 8.39052 11.7238C8.14048 11.9739 8 12.313 8 12.6666V20.6666C8 21.0202 8.14048 21.3594 8.39052 21.6094C8.64057 21.8595 8.97971 22 9.33333 22C9.68696 22 10.0261 21.8595 10.2761 21.6094C10.5262 21.3594 10.6667 21.0202 10.6667 20.6666V12.6666ZM16 12.6666C16 12.313 15.8595 11.9739 15.6095 11.7238C15.3594 11.4738 15.0203 11.3333 14.6667 11.3333C14.313 11.3333 13.9739 11.4738 13.7239 11.7238C13.4738 11.9739 13.3333 12.313 13.3333 12.6666V20.6666C13.3333 21.0202 13.4738 21.3594 13.7239 21.6094C13.9739 21.8595 14.313 22 14.6667 22C15.0203 22 15.3594 21.8595 15.6095 21.6094C15.8595 21.3594 16 21.0202 16 20.6666V12.6666Z"
        fill={IconColors[props.color]}
      />
    </svg>
  );
}