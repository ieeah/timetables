"use server";

import React from "react";
import { Lora, Roboto } from "../../../../fonts/fonts";
import "./footer.scss";

export default async function Footer() {
  return (
    <footer
      className={`footer ${Lora.className}`}
    >
      Developed by <small><a href="https://github.com/ieeah" target="_blank" className={Roboto.className}>Ieeah</a></small> @U1P1 ®
    </footer>
  )
};