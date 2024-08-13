import { IconProps } from "./types";

import CheckIcon from "./icons/CheckIcon";
import CloseIcon from "./icons/CloseIcon";
import ClockIcon from "./icons/ClockIcon";
import { CloudOnIcon, CloudOffIcon } from "./icons/CloudIcons";
import { DarkOffIcon, DarkOnIcon } from "./icons/DarkIcons";
import DeleteIcon from "./icons/DeleteIcon";
import EditIcon from "./icons/EditIcon";
import { EyeOffIcon, EyeOnIcon } from "./icons/EyeIcons";
import InfoIcon from "./icons/InfoIcon";
import KebabIcon from "./icons/KebabIcon";
import LightningIcon from "./icons/LightningIcon";
import { LockOffIcon, LockOnIcon } from "./icons/LockIcons";
import { LightOffIcon, LightOnIcon } from "./icons/LightIcons";
import {
  NotificationOffIcon,
  NotificationOnIcon,
} from "./icons/NotificationIcons";
import RefreshIcon from "./icons/RefreshIcon";

const iconMap = {
  check: CheckIcon,
  close: CloseIcon,
  clock: ClockIcon,
  "cloud-off": CloudOffIcon,
  "cloud-on": CloudOnIcon,
  "dark-off": DarkOffIcon,
  "dark-on": DarkOnIcon,
  delete: DeleteIcon,
  edit: EditIcon,
  "eye-off": EyeOffIcon,
  "eye-on": EyeOnIcon,
  info: InfoIcon,
  kebab: KebabIcon,
  lightning: LightningIcon,
  "lock-off": LockOffIcon,
  "lock-on": LockOnIcon,
  "light-off": LightOffIcon,
  "light-on": LightOnIcon,
  "notification-off": NotificationOffIcon,
  "notification-on": NotificationOnIcon,
  refresh: RefreshIcon,
};

function DispatchIcon({
  icon,
  size = "md",
  thickness = "bold",
  color = "default",
  ...props
}: Readonly<IconProps>) {
  const IconComponent = iconMap[icon];
  if (!IconComponent) {
    throw new Error("Nessun tipo di icona selezionata");
  }
  return (
    <IconComponent
      icon={icon}
      size={size}
      color={color}
      thickness={thickness}
      {...props}
    />
  );
}

export default DispatchIcon;
