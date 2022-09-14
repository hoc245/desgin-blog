import React from "react";
import Card from "../Components/Card";
import Hero from "../Components/Hero";

export default function Result() {
  return (
    <div className="main">
      <Hero />
      <section className="breakcrumb">
        <h3 style={{ width: "100%", textAlign: "center" }}>Up coming</h3>
      </section>
    </div>
  );
}
