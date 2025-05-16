import React from "react";
import ScrollySection from "./components/ScrollySection";
import Court from "./components/Court";
import "./index.css";

function App() {
  return (
    <div className="App">
      <section className="intro">
        <h1>NBA Shot Visualization</h1>
        <p>Explore shot patterns and efficiency on an interactive basketball court.</p>
      </section>

      <ScrollySection>
        <h2>Visualizing the Court</h2>
        <Court />
      </ScrollySection>

      <ScrollySection>
        <h2>Shot Density Map</h2>
        <p>(Future: Heatmap of shots)</p>
      </ScrollySection>

      <ScrollySection>
        <h2>Efficiency Analysis</h2>
        <p>(Future: Color-coded zones for FG% analysis)</p>
      </ScrollySection>
    </div>
  );
}

export default App;
