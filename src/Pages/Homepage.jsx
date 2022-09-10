import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../Components/Button";
import Card from "../Components/Card";
import Footer from "../Components/Footer";
import Hero from "../Components/Hero";
import Popup from "../Components/Popup";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

export default function Homepage() {
  const [postThumb, setPostThumb] = useState();
  const [postPopup, setPostPopup] = useState({
    trigger: false,
    id: "",
  });
  useEffect(() => {
    onValue(ref(db, `/postThumb/`), (snapshot) => {
      setPostThumb(snapshot.val());
    });
  }, []);
  const newPost = postThumb
    ? Object.keys(postThumb)
        .sort((a, b) => {
          return b - a;
        })
        .splice(0, 4)
    : [];
  const graphicPost = postThumb
    ? Object.keys(postThumb)
        .filter((item) => {
          if (postThumb[`${item}`].catalogue === "Graphic Design") {
            return true;
          }
        })
        .sort((a, b) => {
          return b - a;
        })
        .splice(0, 4)
    : [];
  const uiuxPost = postThumb
    ? Object.keys(postThumb)
        .filter((item) => {
          if (postThumb[`${item}`].catalogue === "UI/UX Design") {
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
      <div className="main">
        <Hero />
        <div className="main-content">
          <section className="breakcrumb">
            <h3>Lastest</h3>
            <hr></hr>
            <span>Wednesday, 24/08/2022</span>
          </section>
          <section className="card-container">
            {postThumb &&
              newPost.map((post) => {
                return (
                  <Card
                    key={`new${post}`}
                    trigger={postPopup.trigger}
                    setPostPopup={setPostPopup}
                    postID={post}
                    title={postThumb[`${post}`].title}
                    description={postThumb[`${post}`].description}
                    cover={postThumb[`${post}`].image}
                    time={post}
                    tags={Object.keys(postThumb[`${post}`].tags)}
                    type={newPost.indexOf(post) === 0 ? null : ""}
                  />
                );
              })}
          </section>
          <section className="breakcrumb">
            <h3>Graphic Design</h3>
            <hr></hr>
          </section>
          <section className="card-container">
            {postThumb &&
              graphicPost.map((post) => {
                return (
                  <Card
                    key={`graphic${post}`}
                    trigger={postPopup.trigger}
                    setPostPopup={setPostPopup}
                    postID={post}
                    title={postThumb[`${post}`].title}
                    description={postThumb[`${post}`].description}
                    cover={postThumb[`${post}`].image}
                    time={post}
                    tags={Object.keys(postThumb[`${post}`].tags)}
                    type={graphicPost.indexOf(post) === 0 ? null : ""}
                  />
                );
              })}
            <Link className="seemore-btn" to={"/Result/Graphic-Design"}>
              <Button
                value={"See all"}
                state="is-outline"
                iconRight="chevron_right"
              />
            </Link>
          </section>
          <section className="breakcrumb">
            <h3>UI/UX Design</h3>
            <hr></hr>
          </section>
          <section className="card-container">
            {postThumb &&
              uiuxPost.map((post) => {
                return (
                  <Card
                    key={`uiux${post}`}
                    setPostPopup={setPostPopup}
                    postID={post}
                    title={postThumb[`${post}`].title}
                    description={postThumb[`${post}`].description}
                    cover={postThumb[`${post}`].image}
                    time={post}
                    tags={Object.keys(postThumb[`${post}`].tags)}
                    type={uiuxPost.indexOf(post) === 0 ? null : ""}
                  />
                );
              })}
            <Link className="seemore-btn" to={"/Result/Graphic-Design"}>
              <Button
                value={"See all"}
                state="is-outline"
                iconRight="chevron_right"
              />
            </Link>
          </section>
        </div>
        <Popup
          trigger={postPopup.trigger}
          postID={postPopup.id}
          setTriggerPopup={setPostPopup}
        />
      </div>
      <Footer />
    </>
  );
}
