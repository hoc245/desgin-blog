import React, { useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import Button from "./Button";
import logo from "../Images/logo.png";
import Login from "./Login";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Nav({ catalogue, loginState, user, triggerPopup }) {
  const [triggerLogin, setTriggerLogin] = useState(false);
  const param = useParams();
  let location = useLocation();
  window.addEventListener("scroll", () => {
    let nav = document.querySelector(".nav");
    if (document.documentElement.scrollTop === 0) {
      nav.classList.remove("is-scroll");
    } else {
      nav.classList.add("is-scroll");
    }
  });
  const handleLogout = () => {
    signOut(auth);
  };
  return (
    <>
      <nav
        className={`${
          location.pathname.includes("Result") ||
          location.pathname.includes("Account") ||
          location.pathname.includes("Postmanagement")
            ? "is-result nav"
            : "nav"
        }`}
      >
        <div className="nav-container">
          <div className="nav-left">
            <Link className={"logo"} to="/Homepage">
              <img src={logo} alt="logo" />
            </Link>
            <Link
              className={
                "nav-item " +
                `${!location.pathname.includes("Course") ? "is-active" : ""}`
              }
              to="/Homepage"
            >
              News
            </Link>
            <Link
              className={
                "nav-item " +
                `${location.pathname.includes("Course") ? "is-active" : ""}`
              }
              to="/Course"
            >
              Courses
            </Link>
            <div className="nav-dropdown">
              <div className="nav-dropdown-title">Catalogies</div>
              <ul className="nav-dropdown-menu">
                <Link
                  className={`${
                    location.pathname.includes("Homepage")
                      ? "nav-dropdown-menu-item is-active"
                      : "nav-dropdown-menu-item"
                  }`}
                  to="/Homepage"
                >
                  All
                </Link>
                <Link
                  className={`${
                    location.pathname.includes("Latest")
                      ? "nav-dropdown-menu-item is-active"
                      : "nav-dropdown-menu-item"
                  }`}
                  to="/Result/Latest"
                >
                  Latest
                </Link>
                {catalogue &&
                  catalogue.map((cata) => {
                    return (
                      <Link
                        className={`${
                          param.id &&
                          param.id.includes(
                            cata.replace(" ", "-").replace("/", ".")
                          )
                            ? "nav-dropdown-menu-item is-active"
                            : "nav-dropdown-menu-item"
                        }`}
                        to={`/Result/${cata
                          .replace(" ", "-")
                          .replace("/", ".")}`}
                      >
                        {cata}
                      </Link>
                    );
                  })}
                <Link
                  className={`${
                    location.pathname.includes("Saved")
                      ? "nav-dropdown-menu-item is-active"
                      : "nav-dropdown-menu-item"
                  }`}
                  to="/Result/Saved"
                >
                  Saved
                </Link>
              </ul>
            </div>
          </div>
          <>
            {!loginState ? (
              <div className="nav-right">
                <Button
                  value={"Create a post"}
                  iconLeft="add"
                  state="is-outline"
                  onClick={() => {
                    triggerPopup(true);
                  }}
                />
                <Link to={"/About"}>
                  <Button value={"About us"} state={"is-ghost"} />
                </Link>
                <Button
                  value={"Sign In"}
                  onClick={() => {
                    setTriggerLogin(true);
                  }}
                />
              </div>
            ) : (
              <div className="nav-right">
                <Button
                  value={"Create a post"}
                  iconLeft="add"
                  state="is-outline"
                  onClick={() => {
                    triggerPopup(true);
                  }}
                />
                <Link to={"/About"}>
                  <Button value={"About us"} state={"is-ghost"} />
                </Link>
                <div
                  className="nav-user"
                  onClick={(e) => {
                    e.currentTarget.lastChild.classList.toggle("is-active");
                  }}
                >
                  <img src={`${user && user.image}`} alt="user-image" />
                  <ul className="nav-user-dropdown">
                    <li className="--dropdown-item">
                      <Link to="/Result/Saved">Saved post</Link>
                    </li>
                    <li className="--dropdown-item">
                      <Link to="/Account">Account</Link>
                    </li>
                    <li className="--dropdown-item">
                      <Link to="/Postmanagement">Post Management</Link>
                    </li>
                    <li
                      className="--dropdown-item"
                      onClick={() => {
                        handleLogout();
                      }}
                    >
                      Sign out
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </>
        </div>
      </nav>
      <Login trigger={triggerLogin} setTriggerPopup={setTriggerLogin} />
    </>
  );
}
