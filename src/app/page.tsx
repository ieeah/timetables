import "./components/Button/button.scss";
import LoginBox from "./components/LoginBox/LoginBox";
import PageTitle from "./components/PageTitle/PageTitle";
import "./style/home.css";

export default function Home() {
  return (
    <main className="home">
      <div className="gradient-wrapper">
        <PageTitle subtitle={"Il tool per capire a che ora puoi uscire venerdì dall' ufficio"} />
      </div>
      <LoginBox />
      <div className="gradient-wrapper"></div>
    </main>
  );
}
