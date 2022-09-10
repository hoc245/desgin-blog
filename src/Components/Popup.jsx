import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Button from "./Button";
import Card from "./Card";

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

export default function Popup(props) {
  const [post, setPost] = useState();
  useEffect(() => {
    if (props.postID) {
      onValue(ref(db, `/postDetail/${props.postID}`), (snapshot) => {
        setPost(snapshot.val());
      });
    }
  }, [props.postID]);
  useEffect(() => {
    if (props.trigger && post) {
      let popup = document.querySelector(".popup");
      popup.removeAttribute("style");
      popup.scrollTo(0, 0);
      document.body.setAttribute("style", "overflow:hidden");
      setTimeout(() => {
        popup.classList.add("is-active");
      }, 0);
    } else {
      document.body.setAttribute("style", "overflow:auto");
    }
  }, [props.trigger, post]);
  var ago = "";
  if (post && post.createAt !== "") {
    ago = timeSince(new Date(post.createAt));
  }
  const closePopup = () => {
    let popup = document.querySelector(".popup");
    popup.classList.remove("is-active");
    setTimeout(() => {
      props.setTriggerPopup(false);
    }, 200);
  };

  return props.trigger && post ? (
    <div className="popup" style={{ display: "none" }}>
      <Button
        value=""
        iconLeft="close"
        state="is-filled popup-close"
        onClick={() => {
          closePopup();
        }}
      />
      <div className="popup-container">
        <section className="breakcrumb">
          <h3>{post.catalogue}</h3>
          <hr></hr>
        </section>
        <section className="popup-content">
          <h2>{post.title}</h2>
          <div className="card-description">
            <div className="description-time">
              <span className="material-symbols-outlined">schedule</span>
              <span>{ago}</span>
            </div>
            <Button
              value={"Save"}
              iconLeft="favorite"
              state="is-ghost"
              isSmall="true"
            />
            <Button
              value={"Share"}
              iconLeft="share"
              state="is-ghost"
              isSmall="true"
            />
          </div>
          <h4>{post.description}</h4>
          <div dangerouslySetInnerHTML={{ __html: post.body }}></div>
          <p className="source">
            Source:
            <a href={post.source} target={"_blank"} rel="noreferrer">
              {post.source}
            </a>
          </p>
          <div className="post-comment">
            <textarea
              rows={3}
              placeholder={"How do you think about this post?"}
            ></textarea>
            <Button value="Send" isSmall="true" />
            <h4>Comment</h4>
            <div className="post-comment-item">
              <img
                src="https://work.conando.vn/upload/220223/637812349690327647.jpg"
                alt="user"
              />
              <div className="post-comment-item-content">
                <p>Jane Cooper</p>
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  eu turpis molestie, dictum est a, mattis tellus
                </span>
              </div>
            </div>
            <div className="post-comment-item">
              <img
                src="https://work.conando.vn/upload/220223/637812349690327647.jpg"
                alt="user"
              />
              <div className="post-comment-item-content">
                <p>Jane Cooper</p>
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  eu turpis molestie, dictum est a, mattis tellus
                </span>
              </div>
            </div>
            <div className="post-comment-item">
              <img
                src="https://work.conando.vn/upload/220223/637812349690327647.jpg"
                alt="user"
              />
              <div className="post-comment-item-content">
                <p>Jane Cooper</p>
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  eu turpis molestie, dictum est a, mattis tellus
                </span>
              </div>
            </div>
            <Button value="More" state="is-ghost" isSmall="true" />
            <div className="related-news">
              <section className="breakcrumb">
                <h3>UI/ UX Design</h3>
                <hr></hr>
              </section>
              <Card
                postID="post-020"
                title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam"
                description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..."
                cover=""
                time="09/02/2022"
                tags={["Lastest", "UI/UX"]}
              />
              <Card
                postID="post-021"
                title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam"
                description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..."
                cover=""
                time="09/02/2022"
                tags={["Lastest", "UI/UX"]}
              />
              <Card
                postID="post-022"
                title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam"
                description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..."
                cover=""
                time="09/02/2022"
                tags={["Lastest", "UI/UX"]}
              />
            </div>
            <hr></hr>
          </div>
        </section>
      </div>
      <div className="popup-overlay"></div>
    </div>
  ) : (
    <></>
  );
}
