import { IconProps } from "./types";

import CheckIcon from "./icons/CheckIcon";
import ChevronIcon from "./icons/ChevronIcon";
import ClockIcon from "./icons/ClockIcon";
import CloseIcon from "./icons/CloseIcon";
import { CloudOffIcon, CloudOnIcon } from "./icons/CloudIcons";
import { DarkOffIcon, DarkOnIcon } from "./icons/DarkIcons";
import DeleteIcon from "./icons/DeleteIcon";
import EditIcon from "./icons/EditIcon";
import { EyeOffIcon, EyeOnIcon } from "./icons/EyeIcons";
import InfoIcon from "./icons/InfoIcon";
import KebabIcon from "./icons/KebabIcon";
import { LightOffIcon, LightOnIcon } from "./icons/LightIcons";
import LightningIcon from "./icons/LightningIcon";
import { LockOffIcon, LockOnIcon } from "./icons/LockIcons";
import {
  NotificationOffIcon,
  NotificationOnIcon,
} from "./icons/NotificationIcons";
import RefreshIcon from "./icons/RefreshIcon";
import SettingsIcon from "./icons/SettingsIcon";
import TogglesIcon from "./icons/TogglesIcon";
import { UserOffIcon, UserOnIcon } from "./icons/UserIcons";

const iconMap = {
  "check": CheckIcon,
  "close": CloseIcon,
  "clock": ClockIcon,
  "cloud-off": CloudOffIcon,
  "cloud-on": CloudOnIcon,
  "dark-off": DarkOffIcon,
  "dark-on": DarkOnIcon,
  "delete": DeleteIcon,
  "edit": EditIcon,
  "eye-off": EyeOffIcon,
  "eye-on": EyeOnIcon,
  "info": InfoIcon,
  "kebab": KebabIcon,
  "lightning": LightningIcon,
  "lock-off": LockOffIcon,
  "lock-on": LockOnIcon,
  "light-off": LightOffIcon,
  "light-on": LightOnIcon,
  "notification-off": NotificationOffIcon,
  "notification-on": NotificationOnIcon,
  "refresh": RefreshIcon,
  "settings": SettingsIcon,
  "toggles": TogglesIcon,
  "user-off": UserOffIcon,
  "user-on": UserOnIcon,
  "chevron-left": ChevronIcon,
  "chevron-right": ChevronIcon,
  "chevron-top": ChevronIcon,
  "chevron-bottom": ChevronIcon,
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
