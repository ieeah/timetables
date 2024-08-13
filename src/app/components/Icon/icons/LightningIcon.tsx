import { IconProps, IconColors, IconSizes } from "../types";

export default function LightningIcon({ ...props }: Readonly<IconProps>) {
  return (
    <svg
      width={IconSizes[props.size]}
      height={IconSizes[props.size]}
      viewBox="0 0 20 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.6667 1.66665C12.6668 1.37354 12.5704 1.08855 12.3923 0.855765C12.2142 0.622978 11.9643 0.455367 11.6814 0.378862C11.3984 0.302356 11.0981 0.321219 10.827 0.432533C10.5558 0.543846 10.3289 0.741407 10.1813 0.994653L0.848003 16.9947C0.729762 17.1973 0.667079 17.4275 0.666283 17.6621C0.665486 17.8967 0.726605 18.1274 0.843467 18.3308C0.96033 18.5342 1.1288 18.7032 1.33186 18.8207C1.53493 18.9382 1.7654 19.0001 2 19H7.33334V28.3333C7.33319 28.6264 7.42963 28.9114 7.60774 29.1442C7.78585 29.377 8.0357 29.5446 8.31865 29.6211C8.6016 29.6976 8.90188 29.6788 9.17303 29.5674C9.44418 29.4561 9.67109 29.2586 9.81867 29.0053L19.152 13.0053C19.2702 12.8027 19.3329 12.5725 19.3337 12.3378C19.3345 12.1032 19.2734 11.8726 19.1565 11.6692C19.0397 11.4657 18.8712 11.2967 18.6681 11.1792C18.4651 11.0618 18.2346 10.9999 18 11H12.6667V1.66665Z"
        fill={IconColors[props.color]}
      />
    </svg>
  );
}
