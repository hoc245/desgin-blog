import React from "react";
import Button from "./Button";

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
    });
  };
  return (
    <div
      id={props.postID}
      className={`card ${props.type === "" ? props.type : "is-line"}`}
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
        <p>{props.description}</p>
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
      </div>
    </div>
  );
}
