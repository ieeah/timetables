export enum IconSizes {
  "xs" = "1rem",
  "sm" = "1.5rem",
  "md" = "2.3rem",
  "lg" = "2.9rem",
  "xl" = "4rem",
}

export enum IconThickness {
  "light" = "2",
  "medium" = "2.8",
  "bold" = "4",
}

export enum IconColors {
  "warning" = "#E5B44A",
  "success" = "#69E37C",
  "danger" = "#E3696B",
  "info" = "#999999",
  "default" = "#000000",
}

export type IconProps = {
  size?: keyof typeof IconSizes;
  thickness?: keyof typeof IconThickness;
  color?: keyof typeof IconColors;
  icon: AvailableIcons;
};

export type ChevronSides = "top" | "left" | "right" | "bottom";

export type AvailableIcons =
  | "check"
  | "chevron-bottom"
  | "chevron-left"
  | "chevron-right"
  | "chevron-top"
  | "clock"
  | "close"
  | "cloud-off"
  | "cloud-on"
  | "dark-off"
  | "dark-on"
  | "delete"
  | "edit"
  | "eye-off"
  | "eye-on"
  | "info"
  | "kebab"
  | "light-off"
  | "light-on"
  | "lightning"
  | "lock-off"
  | "lock-on"
  | "notification-off"
  | "notification-on"
  | "refresh"
  | "settings"
  | "toggles"
  | "user-off"
  | "user-on";
