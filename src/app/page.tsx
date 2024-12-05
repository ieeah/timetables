import Link from "next/link";

import "./components/Button/button.scss";
import PageTitle from "./components/PageTitle/PageTitle";
import "./style/home.css";

export default function Home() {
  return (
    <main className="home">
      <div className="gradient-wrapper">
        <PageTitle subtitle={"Il tool per capire a che ora puoi uscire venerdì dall' ufficio"} />
      </div>
      <div className="login-btn-wrapper">
        <Link href="/login" className="btn primary login-btn">Accedi</Link>
      </div>
      <div className="gradient-wrapper"></div>
    </main>
  );
}
