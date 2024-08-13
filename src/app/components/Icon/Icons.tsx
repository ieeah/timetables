import { IconProps } from "./types";

import CheckIcon from "./icons/CheckIcon";

const iconMap = {
  check: CheckIcon,
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
