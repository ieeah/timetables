export type InputTypes =
  // | "button"
  // | "checkbox"
  // | "color"
  // | "date"
  // | "datetime-local"
  | "email"
  // | "file"
  // | "hidden"
  // | "image"
  // | "month"
  // | "number"
  | "password"
  // | "radio"
  // | "range"
  // | "reset"
  // | "search"
  // | "submit"
  // | "tel"
  | "text";
// | "time"
// | "url"
// | "week";

export type InputProps = Omit<
  React.HTMLProps<HTMLInputElement>,
  "label" | "type"
> & {
  label: string;
  disableInternalValidation?: boolean;
  infoText?: string;
  type: InputTypes;
};
