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
