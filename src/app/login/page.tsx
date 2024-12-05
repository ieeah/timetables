import React from "react";

import LoginBox from "../components/LoginBox/LoginBox";
import PageTitle from "../components/PageTitle/PageTitle";
import "./login.scss";

export default async function Login() {
  
  return (
    <>
      <PageTitle className="mt-2" subtitle={"Il tool per capire a che ora puoi uscire venerdì dall' ufficio"} />
      <main className="main">
        <LoginBox />
      </main>
    </>
  );
}
