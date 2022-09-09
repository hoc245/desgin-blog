import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../Components/Button";
import Footer from "../Components/Footer";
import aboutImage01 from "../Images/Subscriber-bro.png"
import aboutImage02 from "../Images/Thesis-amico.png"
import user from "../Images/user.png"

export default function About() {
    const [current,setCurrent] = useState(0);
    const translate = `translate(calc(${-100 * current}% - ${32 * current}px),0)`;
    const style = {
        transform : translate
    }
    useEffect(() => {
        if(current === 3) {
            setCurrent(0);
        }
        if(current === -1) {
            setCurrent(2);
        }
    },[current])
    const nextReview = () => {
        setCurrent(current + 1)
    }
    const preReview = () => {
        setCurrent(current - 1)
    }
    return (
        <>
            <div className="main">
            <section className="hero-section">
                <h1>Conando Design News</h1>
                <p>Learn, learn more, learn forever</p>
                <div className="overlay"></div>
            </section>
            <div className="main-content">
                <section className="about">
                    <div className="about-item">
                        <img src={aboutImage01} alt="about"/>
                        <div className="about-content">
                            <h2>Update news</h2>
                            <p>Are you passionate about Design? Do you want to keep up the latest trends and outstanding news in the Design department? Come to Conando Design News - a place that summarizes for you the latest information related to Graphic Design and UI / UX Design department, help keeping you updated and inspired at work.
                            </p>
                            <ul>
                                <Link to="/Homepage">All</Link>
                                <Link to="/Result/Lastest">Lastest</Link>
                                <Link to="/Result/Graphic-Design">Graphic Design</Link>
                                <Link to="/Result/UIUX-Design">UI/UX Design</Link>
                            </ul>
                        </div>
                    </div>
                    <div className="about-item">
                        <img src={aboutImage02} alt="about"/>
                        <div className="about-content">
                            <h2>Update news</h2>
                            <p>Are you passionate about Design? Do you want to keep up the latest trends and outstanding news in the Design department? Come to Conando Design News - a place that summarizes for you the latest information related to Graphic Design and UI / UX Design department, help keeping you updated and inspired at work.
                            </p>
                            <ul>
                                <Link to="/Result/Graphic-Design">Graphic Design</Link>
                                <Link to="/Result/UIUX-Design">UI/UX Design</Link>
                            </ul>
                        </div>
                    </div>
                </section>
                <section className="review">
                    <div className="review-title"><h3>Let's see how users think about us</h3></div>
                    <div className="review-slider">
                        <div className="review-left">
                            <h2>User stories</h2>
                            <p>Learn how our services have helped users from all backgrounds enhance knowledge in Design.</p>
                            <Button value="Share your story" state="is-outline" isSmall="true"/>
                        </div>
                        <div className="review-right">
                            <div className={`${current === 0 ? "review-item is-active" : "review-item" }`} style={style}>
                                <div className="review-item-user">
                                    <img src={user} alt="user"/>
                                    <div className="user-info">
                                        <p>Jane Cooper 1</p>
                                        <span>Graphic Designer</span>
                                    </div>
                                </div>
                                <p>Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.</p>
                            </div>
                            <div className={`${current === 1 ? "review-item is-active" : "review-item" }`} style={style}>
                                <div className="review-item-user">
                                    <img src={user} alt="user"/>
                                    <div className="user-info">
                                        <p>Jane Cooper 2</p>
                                        <span>Graphic Designer</span>
                                    </div>
                                </div>
                                <p>Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.</p>
                            </div>
                            <div className={`${current === 2 ? "review-item is-active" : "review-item" }`} style={style}>
                                <div className="review-item-user">
                                    <img src={user} alt="user"/>
                                    <div className="user-info">
                                        <p>Jane Cooper 3</p>
                                        <span>Graphic Designer</span>
                                    </div>
                                </div>
                                <p>Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.</p>
                            </div>
                            <Button iconRight="chevron_right" state="is-ghost" onClick={() => {nextReview()}}/>
                            <Button iconLeft="chevron_left" state="is-ghost" onClick={() => {preReview()}}/>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <Footer />
        </>
    )
}