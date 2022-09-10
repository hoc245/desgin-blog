import React from "react";
import { Link } from "react-router-dom";
import Button from "../Components/Button";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <h3>
            Our mission is conveying everybody knowledge and free courses.
          </h3>
          <Button value={"Sign up for newsletters"} isSmall="true" />
        </div>
        <div className="footer-right">
          <div className="footer-menu">
            <div className="footer-menu-news">
              <p>News</p>
              <Link to={"/Result/Lastest"}>Lastest</Link>
              <Link to={"/Result/Graphic-Design"}>Graphic Design</Link>
              <Link to={"/Result/UIUX-Design"}>UI/UX-Design</Link>
            </div>
            <div className="footer-menu-course"></div>
          </div>
          <div className="footer-information">
            <p>
              Producer: <span>Conando's design team</span>
            </p>
            <p>
              Email: <span>designnews@gmail.com</span>
            </p>
            <span>
              ® All rights are reserved by Conando Design News. Content may not
              be republished, except with the prior written permission of
              Conando Design News.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
