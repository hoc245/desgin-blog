import { set, ref } from "firebase/database";
import React, { useState } from "react";
import { db } from "../firebase";
import Button from "./Button";
import { motion } from "framer-motion";

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

export default function Card(props) {
  const [user, setUser] = useState(props.user);
  var ago = "";
  const location = window.location;
  let link = "";
  if (location && location.pathname && location.pathname !== "/") {
    if (!location.pathname.includes(props.postID)) {
      link = `${location.pathname}/${props.postID}`;
    } else {
      link = location.pathname;
    }
  } else {
    if (location.pathname.includes("Homepage")) {
      link = `${props.postID}`;
    } else {
      link = `/Homepage/${props.postID}`;
    }
  }
  if (props.time !== "") {
    ago = timeSince(props.time);
  }
  const openPopup = (val) => {
    props.setPostPopup({
      trigger: true,
      id: val,
      user: props.user,
    });
  };
  function checkExist(savedPost, id) {
    return new Promise((resolve, reject) => {
      if (Object.keys(savedPost).indexOf(id) === -1) {
        savedPost[`${id}`] = true;
      } else {
        delete savedPost[`${id}`];
      }
      resolve(savedPost);
      reject("error");
    });
  }
  const handleSavePost = async (id) => {
    const savedPost = user.savedPost ? user.savedPost : {};
    await checkExist(savedPost, id)
      .then((result) => {
        set(ref(db, `/users/${user.id}/savedPost/`), result);
        setUser({
          email: user.email,
          id: user.id,
          image: user.image,
          jobs: user.jobs,
          name: user.name,
          savedPost: result,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <motion.div
      id={props.postID}
      className={`card ${props.type === "" ? props.type : "is-line"}`}
      transition={{ duration: 1, type: "spring" }}
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 1 }}
    >
      <img
        src={
          props.cover
            ? props.cover
            : "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/cb/3c4030d65011e682d8b14e2f0915fa/shutterstock_226881610.jpg?auto=format%2Ccompress&dpr=1"
        }
        alt="cover"
        onClick={() => {
          openPopup(props.postID);
        }}
      />
      <div className="content">
        <div className="tags-container">
          {props.tags.length &&
            props.tags.map((tag) => {
              return (
                <span key={`card-${tag}`} className="tag">
                  {tag}
                </span>
              );
            })}
        </div>
        <h3
          onClick={() => {
            openPopup(props.postID);
          }}
        >
          {props.title}
        </h3>
        <p style={{ display: `${props.description ? "" : "none"}` }}>
          {props.description}
        </p>
        <div className="card-description">
          <div className="description-time">
            <span className="material-symbols-outlined">schedule</span>
            <span>{ago}</span>
          </div>
          <Button
            onClick={() => {
              handleSavePost(props.postID);
            }}
            value={`${
              user.savedPost &&
              Object.keys(user.savedPost).indexOf(props.postID) !== -1
                ? "Saved"
                : "Save"
            }`}
            iconLeft={`${
              user.savedPost &&
              Object.keys(user.savedPost).indexOf(props.postID) !== -1
                ? "favorite"
                : "favorite_border"
            }`}
            state={`${
              user.savedPost &&
              Object.keys(user.savedPost).indexOf(props.postID) !== -1
                ? "is-filled is-saved"
                : "is-ghost"
            }`}
            isSmall="true"
          />
          <Button
            value={"Share"}
            iconLeft="share"
            state="is-ghost"
            isSmall="true"
          />
        </div>
      </div>
    </motion.div>
  );
}
