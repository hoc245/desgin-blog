import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { set, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import Button from "./Button";

function Login(props) {
<<<<<<< HEAD
    const [checked,setChecked] = useState(false);
    const param = useParams();
    const [signUp,setSignUp] = useState(false);
    useEffect(() => {
        if(props.trigger) {
            let popup = document.querySelector('.popup.login');
            popup.removeAttribute('style');
            popup.scrollTo(0,0);
            document.body.setAttribute('style','overflow:hidden');
            setTimeout(() => {
                popup.classList.add('is-active');
            },0)
        } else {
            document.body.setAttribute('style','overflow:auto');
        }
    },[props.trigger]);
    const closePopup = () => {
        let popup = document.querySelector('.popup');
        popup.classList.remove('is-active');
        setTimeout(() => {
            props.setTriggerPopup(false)
        },200)
=======
  const [checked, setChecked] = useState(false);
  const param = useParams();
  const [signUp, setSignUp] = useState(false);
  useEffect(() => {
    if (props.trigger) {
      let popup = document.querySelector(".popup.login");
      popup.removeAttribute("style");
      popup.scrollTo(0, 0);
      document.body.setAttribute("style", "overflow:hidden");
      setTimeout(() => {
        popup.classList.add("is-active");
      }, 0);
    } else {
      document.body.setAttribute("style", "overflow:auto");
>>>>>>> eb62d4a6557f4053e1359ee4c9ff034d4f13e8f2
    }
  }, [props.trigger]);
  const closePopup = () => {
    let popup = document.querySelector(".popup");
    popup.classList.remove("is-active");
    setTimeout(() => {
      props.setTriggerPopup(false);
    }, 200);
  };
  const handleLogin = () => {
    const email = document.querySelector('input[id="email"]').value;
    const password = document.querySelector('input[id="password"]').value;
    const valid = document.querySelector(".login-valid");
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          valid.classList.remove("is-active");
          closePopup();
          Navigate(`${param}`);
        })
        .catch(() => {
          valid.classList.add("is-active");
        });
    } else {
      valid.classList.add("is-active");
    }
  };
  const handleSaveLogin = () => {
    if (checked) {
      localStorage.setItem("saveLogin", false);
    } else {
      localStorage.setItem("saveLogin", true);
    }
    setChecked(!checked);
  };
  const handleSignUp = () => {
    const mail = document.querySelector('input[id="email"]').value;
    const password = document.querySelector('input[id="password"]').value;
    const rePassword = document.querySelector('input[id="re-password"]').value;
    const job = document.querySelector(".jobs-value").innerHTML;
    const valid = document.querySelector(".login-valid");
    if (job === "Your position") {
      job = "Other";
    }
    if (!mail || !password || !rePassword) {
      valid.innerHTML = "Please enter your email and password";
      valid.classList.add("is-active");
    } else if (password !== rePassword) {
      valid.innerHTML = "Password and re-password must be the same";
      valid.classList.add("is-active");
    } else {
      createUserWithEmailAndPassword(auth, mail, password)
        .then(() => {
          valid.classList.remove("is-active");
          set(ref(db, `/users/${auth.currentUser.uid}`), {
            email: mail,
            id: auth.currentUser.uid,
            image: "",
            jobs: job,
            name: mail,
            savedPost: {},
          });
        })
        .then(() => {
          localStorage.setItem("saveLogin", false);
          setSignUp(false);
        })
        .catch(() => {
          valid.innerHTML = "Your Email has been used";
          valid.classList.add("is-active");
        });
    }
  };
  const handleJob = (e) => {
    const value = e.currentTarget.innerHTML;
    const other = document.querySelector(".jobs-other");
    const job = document.querySelector(".jobs-value");
    if (value === "Other") {
      other.classList.add("is-active");
      job.innerHTML = value;
    } else {
      other.classList.remove("is-active");
      job.innerHTML = value;
    }
  };
  return props.trigger ? (
    <div className="popup login">
      <Button
        value=""
        iconLeft={"close"}
        state="is-filled popup-close"
        onClick={() => {
          closePopup();
        }}
      />
      <div className="popup-container">
        {!signUp ? (
          <>
            <section className="popup-title">
              <h2>Login</h2>
            </section>
            <section className="form">
              <label htmlFor="email">
                <span
                  class="material-symbols-outlined"
                  aria-autocomplete="false"
                  autoComplete={"off"}
                >
                  {" "}
                  mail{" "}
                </span>
                <input
                  type={"email"}
                  id="email"
                  name="email"
                  placeholder="Email"
                />
              </label>
              <label htmlFor="password">
                <span
                  class="material-symbols-outlined"
                  aria-autocomplete="false"
                  autoComplete={"off"}
                >
                  {" "}
                  lock{" "}
                </span>
                <input
                  type={"password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                />
              </label>
              <label
                htmlFor="checkbox"
                onClick={() => {
                  handleSaveLogin();
                }}
              >
                <span class="material-symbols-outlined">
                  {checked ? "check_box" : "check_box_outline_blank"}
                </span>
                <span> Remember me </span>
              </label>
            </section>
            <p className="login-valid">Email or password is incorrect</p>
            <Button
              value={"Login"}
              onClick={() => {
                handleLogin();
              }}
            />
            <Button
              value={"Forgot your password"}
              state="is-ghost"
              isSmall={true}
            />
            <p>
              Don't have an account yet?{" "}
              <span
                onClick={() => {
                  setSignUp(true);
                }}
              >
                Sign up here
              </span>
            </p>
          </>
        ) : (
          <>
            <section className="popup-title">
              <h2>Sign Up</h2>
            </section>
            <section className="form">
              <label htmlFor="email">
                <span
                  class="material-symbols-outlined"
                  aria-autocomplete="false"
                  autoComplete={"off"}
                >
                  {" "}
                  mail{" "}
                </span>
                <input
                  type={"email"}
                  id="email"
                  name="email"
                  placeholder="Email"
                />
              </label>
              <label htmlFor="password">
                <span
                  class="material-symbols-outlined"
                  aria-autocomplete="false"
                  autoComplete={"off"}
                >
                  {" "}
                  lock{" "}
                </span>
                <input
                  type={"password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                />
              </label>
              <label htmlFor="re-password">
                <span
                  class="material-symbols-outlined"
                  aria-autocomplete="false"
                  autoComplete={"off"}
                >
                  {" "}
                  lock{" "}
                </span>
                <input
                  type={"password"}
                  id="re-password"
                  name="re-password"
                  placeholder="Re-password"
                />
              </label>
              <div
                className="jobs-dropdown"
                onClick={(e) => {
                  e.currentTarget.lastChild.classList.toggle("is-active");
                }}
              >
                <div className="jobs-title">
                  <span className="material-symbols-outlined"> work </span>
                  <span className="jobs-value">Your position</span>
                  <span className="material-symbols-outlined">
                    {" "}
                    expand_more{" "}
                  </span>
                </div>
                <ul className="jobs-dropdown-menu">
                  <li
                    className="jobs-dropdown-item"
                    onClick={(e) => {
                      handleJob(e);
                    }}
                  >
                    Graphic Designer
                  </li>
                  <li
                    className="jobs-dropdown-item"
                    onClick={(e) => {
                      handleJob(e);
                    }}
                  >
                    UI/UX Designer
                  </li>
                  <li
                    className="jobs-dropdown-item"
                    onClick={(e) => {
                      handleJob(e);
                    }}
                  >
                    Product Designer
                  </li>
                  <li
                    className="jobs-dropdown-item"
                    onClick={(e) => {
                      handleJob(e);
                    }}
                  >
                    Interaction Designer
                  </li>
                  <li
                    className="jobs-dropdown-item"
                    onClick={(e) => {
                      handleJob(e);
                    }}
                  >
                    Other
                  </li>
                </ul>
              </div>
              <div className="jobs-other">
                <input type={"text"} placeholder={"Enter your position"} />
              </div>
            </section>
            <p className="login-valid">Email or password is incorrect</p>
            <Button
              value={"Sign Up"}
              onClick={() => {
                handleSignUp();
              }}
            />
            <p>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setSignUp(false);
                }}
              >
                Sign up here
              </span>
            </p>
          </>
        )}
      </div>
      <div className="popup-overlay"></div>
    </div>
  ) : (
    <></>
  );
}

export default Login;
