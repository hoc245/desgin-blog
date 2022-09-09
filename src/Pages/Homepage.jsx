import React from "react";
import { Link } from "react-router-dom";
import Button from "../Components/Button";
import Card from "../Components/Card";
import Footer from "../Components/Footer";
import Hero from "../Components/Hero";

export default function Homepage() {
    return (
        <>
            <div className="main">
                <Hero />
                <div className="main-content">
                    <section className="breakcrumb">
                        <h3>Lastest</h3>
                        <hr></hr>
                        <span>Wednesday, 24/08/2022</span>
                    </section>
                    <section className="card-container">
                        <Card postID="post-001" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]}/>
                        <Card postID="post-002" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]} type=""/>
                        <Card postID="post-003" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]} type=""/>
                        <Card postID="post-004" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]} type=""/>
                    </section>
                    <section className="breakcrumb">
                        <h3>Graphic Design</h3>
                        <hr></hr>
                    </section>
                    <section className="card-container">
                        <Card postID="post-005" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]} type=""/>
                        <Card postID="post-006" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]} type=""/>
                        <Card postID="post-007" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]} type=""/>
                        <Link className="seemore-btn" to={"/Result/Graphic-Design"} >
                            <Button value={"See all"} state="is-outline" iconRight="chevron_right"/>
                        </Link>
                    </section>
                    <section className="breakcrumb">
                        <h3>UI/UX Design</h3>
                        <hr></hr>
                    </section>
                    <section className="card-container">
                        <Card postID="post-008" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]} type=""/>
                        <Card postID="post-009" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]} type=""/>
                        <Card postID="post-010" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]} type=""/>
                        <Link className="seemore-btn" to={"/Result/Graphic-Design"} >
                            <Button value={"See all"} state="is-outline" iconRight="chevron_right"/>
                        </Link>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    )
}