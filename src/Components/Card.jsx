import React, { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
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


export default function Card({postID,title="",description="",cover="",time="",tags=[],type="is-line"}) {
    var ago = "";
    const location = window.location
    let link = "";
      if(location && location.pathname && location.pathname !== "/" ) {
        if(!location.pathname.includes(postID)) {
          link = `${location.pathname}/${postID}`
        } else {
          link = location.pathname
        }
      } else {
        if(location.pathname.includes('Homepage')) {
          link = `${postID}`
        } else {
          link = `/Homepage/${postID}`
        }
      }
    if( time !== "" ) {
        ago = timeSince(new Date(time));
    }
    if( cover === "" ) {
        cover = "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/cb/3c4030d65011e682d8b14e2f0915fa/shutterstock_226881610.jpg?auto=format%2Ccompress&dpr=1"
    }
    const handlePopup = () => {
      console.log('Ok')
      let popup = document.querySelector('.popup');
      if(popup) {
        if(!popup.classList.contains('is-active')) {
          popup.removeAttribute('style');
          popup.classList.add('is-active');
          popup.scrollTo(0,0);
          document.body.setAttribute('style','overflow:hidden');
        }
      }
    }
    return(
        <div id={postID} className={`card ${type}`}>
            <Link to={link} ><img src={cover} alt="cover" onClick={() => {handlePopup()}}/></Link>
            <div className="content">
                <div className="tags-container">
                    {tags.length && tags.map(tag => {
                        return <span key={`card-${tag}`} className="tag">{tag}</span>
                    })}
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="card-description">
                    <div className="description-time">
                        <span className="material-symbols-outlined">schedule</span>
                        <span>{ago}</span>
                    </div>
                    <Button value={"Save"} iconLeft="favorite" state="is-ghost" isSmall="true"/>
                    <Button value={"Share"} iconLeft="share" state="is-ghost" isSmall="true"/>
                </div>
            </div>
        </div>
    )
}