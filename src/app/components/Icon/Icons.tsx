import { IconProps } from "./types";

import CheckIcon from "./icons/CheckIcon";
import CloseIcon from "./icons/CloseIcon";
import ClockIcon from "./icons/ClockIcon";
import { CloudOnIcon, CloudOffIcon } from "./icons/CloudIcons";
import { DarkOffIcon, DarkOnIcon } from "./icons/DarkIcons";

const iconMap = {
  check: CheckIcon,
  close: CloseIcon,
  clock: ClockIcon,
  "cloud-off": CloudOffIcon,
  "cloud-on": CloudOnIcon,
  "dark-off": DarkOffIcon,
  "dark-on": DarkOnIcon,
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
