import React from "react";
import Card from "../Components/Card";
import Hero from "../Components/Hero";

export default function Result() {
  return (
    <div className="main">
      <Hero />
      <section className="breakcrumb">
        <h3>Lastest</h3>
        <hr></hr>
        <span>Wednesday, 24/08/2022</span>
      </section>
      <section className="card-container">
        <Card
          title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam"
          description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..."
          cover=""
          time="09/02/2022"
          tags={["Lastest", "UI/UX"]}
        />
        <Card
          title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam"
          description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..."
          cover=""
          time="09/02/2022"
          tags={["Lastest", "UI/UX"]}
          type=""
        />
        <Card
          title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam"
          description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..."
          cover=""
          time="09/02/2022"
          tags={["Lastest", "UI/UX"]}
          type=""
        />
        <Card
          title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam"
          description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..."
          cover=""
          time="09/02/2022"
          tags={["Lastest", "UI/UX"]}
          type=""
        />
      </section>
    </div>
  );
}
