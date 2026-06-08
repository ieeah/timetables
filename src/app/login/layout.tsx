import type { ReactNode } from "react";
import Footer from "../components/Footer/Footer";
import "../style/globals/globals.css";
import "../style/globals/utilities.css";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
