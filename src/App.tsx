import { useState } from "react";
import "./App.css";
import csvData from "../public/shots.csv";
import { Court } from "./Court";

function App() {
  console.log(csvData);
  return (
    <>
      <section id="center">
        <div className="hero"></div>
        <div>
          <h1>Basketball Analysis Tool</h1>
          <p>lorem ipsum</p>
        </div>

        <Court />
      </section>

      <div className="ticks"></div>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App;
