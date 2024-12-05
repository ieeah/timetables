"use server";

import { Roboto } from "../../fonts/fonts";
import Footer from "./components/Footer/Footer";
import "./style/globals/globals.css";
import "./style/globals/reset.css";
import "./style/globals/utilities.css";
import "./style/layout.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <title>Timetables</title>
        <meta
          name="description"
          content="Il tool per capire a che ora puoi uscire venerdì dall' ufficio"
        />
      </head>
      <body className={`${Roboto.className} layout`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
