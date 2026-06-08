import type { Metadata } from "next";
import { Roboto } from "../../fonts/fonts";
import "./style/globals/globals.css";
import "./style/globals/utilities.css";

export const metadata: Metadata = {
  title: "Timetables",
  description: "Il tool per capire a che ora puoi uscire venerdì dall' ufficio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={Roboto.className}>
        {children}
      </body>
    </html>
  );
}
