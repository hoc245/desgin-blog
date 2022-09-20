import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../Components/Button";
import Card from "../Components/Card";
import Footer from "../Components/Footer";
import Hero from "../Components/Hero";
import Popup from "../Components/Popup";
import { ref, onValue } from "firebase/database";
import { auth, db } from "../firebase";

function getDayName(dateStr) {
  var date = new Date(parseInt(dateStr));
  return date.toLocaleDateString("en-EN", { weekday: "long" });
}
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(date) {
  var day = new Date(parseInt(date));
  return [
    padTo2Digits(day.getDate()),
    padTo2Digits(day.getMonth() + 1),
    day.getFullYear(),
  ].join("/");
}

export default function Homepage() {
  const [postThumb, setPostThumb] = useState();
  const [user, setUser] = useState();
  const [catalogue, setCatalogue] = useState();
  const [tags, setTags] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(db, `/users/${user.uid}`), (snapshot) => {
          setUser(snapshot.val());
        });
      }
    });
    setCatalogue(JSON.parse(localStorage.getItem("catalogue")));
    setTags(JSON.parse(localStorage.getItem("tags")));
  }, []);
  useEffect(() => {
    let popup = document.querySelector(".popup.is-active");
    if (popup) {
      document.body.setAttribute("style", "overflow:hidden");
    } else {
      document.body.removeAttribute("style");
    }
  }, [user]);
  const [postPopup, setPostPopup] = useState({
    trigger: false,
    id: "",
    user: user,
  });
  useEffect(() => {
    onValue(ref(db, `/postThumb/`), (snapshot) => {
      setPostThumb(snapshot.val());
      setPostPopup({
        trigger: false,
        id: "",
        allPost: snapshot.val(),
      });
    });
  }, []);
  const newPost = postThumb
    ? Object.keys(postThumb)
        .sort((a, b) => {
          return b - a;
        })
        .splice(0, 4)
    : [];
  return (
    <>
      <div className="main">
        <Hero catalogue={catalogue ? catalogue : null} />
        <div className="main-content">
          <section className="breakcrumb">
            <h3>Latest</h3>
            <hr></hr>
            {postThumb && newPost ? (
              <span>{`${getDayName(newPost[0])}, ${formatDate(
                newPost[0]
              )}`}</span>
            ) : (
              <></>
            )}
          </section>
          <section className="card-container">
            {postThumb &&
              newPost.map((post) => {
                return (
                  <Card
                    user={user}
                    creator={
                      postThumb[`${post}`].creator
                        ? postThumb[`${post}`].creator
                        : null
                    }
                    key={`new${post}`}
                    setPostPopup={setPostPopup}
                    postID={post}
                    title={postThumb[`${post}`].title}
                    description={postThumb[`${post}`].description}
                    cover={postThumb[`${post}`].image}
                    time={post}
                    tags={postThumb[`${post}`].tags}
                    type={newPost.indexOf(post) === 0 ? null : ""}
                  />
                );
              })}
          </section>
          {catalogue && postThumb ? (
            <>
              {catalogue.map((cata) => {
                const cataPost = postThumb
                  ? Object.keys(postThumb)
                      .filter((item) => {
                        if (postThumb[`${item}`].catalogue === cata) {
                          return true;
                        }
                      })
                      .sort((a, b) => {
                        return b - a;
                      })
                      .splice(0, 4)
                  : [];
                return (
                  <>
                    <section className="breakcrumb">
                      <h3>{cata}</h3>
                      <hr></hr>
                    </section>
                    <section className="card-container">
                      {cataPost &&
                        cataPost.map((post) => {
                          return (
                            <Card
                              user={user}
                              creator={
                                postThumb[`${post}`].creator
                                  ? postThumb[`${post}`].creator
                                  : null
                              }
                              key={`graphic${post}`}
                              setPostPopup={setPostPopup}
                              postID={post}
                              title={postThumb[`${post}`].title}
                              description={postThumb[`${post}`].description}
                              cover={postThumb[`${post}`].image}
                              time={post}
                              tags={postThumb[`${post}`].tags}
                              type={cataPost.indexOf(post) === 0 ? null : ""}
                            />
                          );
                        })}
                      <Link
                        className="seemore-btn"
                        to={"/Result/Graphic-Design"}
                      >
                        <Button
                          value={"See all"}
                          state="is-outline"
                          iconRight="chevron_right"
                        />
                      </Link>
                    </section>
                  </>
                );
              })}
            </>
          ) : (
            <></>
          )}
        </div>
        <Popup
          trigger={postPopup.trigger}
          postID={postPopup.id}
          allPost={postThumb}
          setTriggerPopup={setPostPopup}
        />
      </div>
      <Footer />
    </>
  );
}
