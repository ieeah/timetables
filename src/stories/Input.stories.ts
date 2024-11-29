import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import "../../fonts/fonts.ts";
import Input from "../app/components/Input/Input";
import "../app/components/Input/input.scss";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Input",
  component: Input,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    type: {
      control: "select",
      options: [
        // "button",
        // "checkbox",
        // "color",
        // "date",
        // "datetime-local",
        "email",
        // "file",
        // "hidden",
        // "image",
        // "month",
        // "number",
        "password",
        // "radio",
        // "range",
        // "reset",
        // "search",
        // "submit",
        // "tel",
        "text",
        // "time",
        // "url",
        // "week",
      ],
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Email: Story = {
  args: {
    type: "email",
    label: "Email",
    required: true,
  },
};

export const Password: Story = {
  args: {
    type: "password",
    label: "Password",
    required: true,
  },
};
