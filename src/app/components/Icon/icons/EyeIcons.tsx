import { IconProps, IconColors, IconSizes } from "../types";

export function EyeOffIcon({ ...props }: Readonly<IconProps>) {
  return (
    <svg
      width={IconSizes[props.size]}
      height={IconSizes[props.size]}
      viewBox="0 0 30 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.276 0.39064C5.02453 0.147762 4.68773 0.0133699 4.33813 0.0164078C3.98853 0.0194457 3.65412 0.159671 3.40691 0.406882C3.1597 0.654093 3.01947 0.988509 3.01643 1.3381C3.0134 1.6877 3.14779 2.0245 3.39067 2.27597L5.61733 4.50397C3.30667 6.28797 1.51867 8.71731 0.426666 11.5146C0.304708 11.8267 0.304708 12.1732 0.426666 12.4853C2.73733 18.408 8.17867 22.6666 15 22.6666C17.58 22.6666 19.9733 22.0546 22.08 20.9653L24.724 23.6093C24.9755 23.8522 25.3123 23.9866 25.6619 23.9835C26.0115 23.9805 26.3459 23.8403 26.5931 23.5931C26.8403 23.3459 26.9805 23.0114 26.9836 22.6618C26.9866 22.3122 26.8522 21.9754 26.6093 21.724L23.2747 18.3893C23.2582 18.372 23.2414 18.3551 23.224 18.3386L18.7867 13.9013L18.772 13.8853C18.7667 13.8804 18.7614 13.8755 18.756 13.8706L13.1293 8.24397C13.1193 8.23355 13.1091 8.22333 13.0987 8.21331L8.66 3.77331C8.64355 3.75642 8.62665 3.73997 8.60933 3.72397L5.276 0.39064ZM11.3893 10.276C11.0321 11.0226 10.9153 11.8616 11.055 12.6774C11.1946 13.4932 11.5839 14.2456 12.1692 14.8308C12.7544 15.4161 13.5068 15.8053 14.3226 15.945C15.1384 16.0847 15.9774 15.9679 16.724 15.6106L11.3893 10.276ZM13.4613 4.08931C13.9627 4.02931 14.4747 3.99997 15 3.99997C20.432 3.99997 24.84 7.25731 26.892 12C26.4387 13.0493 25.868 14.0266 25.1973 14.912C25.0916 15.0515 25.0143 15.2105 24.97 15.3799C24.9257 15.5493 24.9152 15.7258 24.9391 15.8993C24.963 16.0727 25.0208 16.2398 25.1093 16.3909C25.1978 16.542 25.3151 16.6742 25.4547 16.78C25.5942 16.8857 25.7532 16.963 25.9226 17.0073C26.092 17.0516 26.2685 17.0621 26.442 17.0382C26.6154 17.0143 26.7825 16.9565 26.9336 16.868C27.0847 16.7795 27.2169 16.6622 27.3227 16.5226C28.2563 15.2872 29.0146 13.9285 29.576 12.4853C29.698 12.1732 29.698 11.8267 29.576 11.5146C27.2627 5.59197 21.8213 1.33331 15 1.33331C14.3733 1.33331 13.7573 1.36931 13.152 1.43997C12.8069 1.4881 12.4943 1.66944 12.2812 1.94517C12.0681 2.2209 11.9714 2.56911 12.0118 2.91524C12.0522 3.26137 12.2266 3.57791 12.4975 3.7971C12.7684 4.01629 13.1144 4.12203 13.4613 4.08931Z"
        fill={IconColors[props.color]}
      />
    </svg>
  );
}

export function EyeOnIcon({ ...props }: Readonly<IconProps>) {
  return (
    <svg
      width={IconSizes[props.size]}
      height={IconSizes[props.size]}
      viewBox="0 0 30 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.42533 10.5147C2.73733 4.59204 8.17866 0.333374 15 0.333374C21.8213 0.333374 27.2627 4.59204 29.576 10.5147C29.698 10.8268 29.698 11.1733 29.576 11.4854C27.2627 17.408 21.8213 21.6667 15 21.6667C8.17866 21.6667 2.73733 17.408 0.42533 11.4854C0.303373 11.1733 0.303373 10.8268 0.42533 10.5147ZM15 15C16.0609 15 17.0783 14.5786 17.8284 13.8285C18.5786 13.0783 19 12.0609 19 11C19 9.93917 18.5786 8.92176 17.8284 8.17161C17.0783 7.42147 16.0609 7.00004 15 7.00004C13.9391 7.00004 12.9217 7.42147 12.1716 8.17161C11.4214 8.92176 11 9.93917 11 11C11 12.0609 11.4214 13.0783 12.1716 13.8285C12.9217 14.5786 13.9391 15 15 15Z"
        fill={IconColors[props.color]}
      />
    </svg>
  );
}