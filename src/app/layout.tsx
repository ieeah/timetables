import type { Metadata } from "next";
import { Roboto } from "../../fonts/fonts";
import Footer from "./components/Footer/Footer";
import styles from "./home.module.css";
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
      <body className={`${Roboto.className} ${styles.layout}`}>
        <div className={styles.pageWrapper}>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
