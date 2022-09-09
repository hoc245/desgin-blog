import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
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

  
export default function Popup({time}) {
    var ago = "";
    if( time !== "" ) {
        ago = timeSince(new Date(time));
    }
    let { id } = useParams();
    useEffect(() => {
        let catalogies = document.querySelectorAll(".--catalogies-item");
        let catalogiesArray = [];
        let popup = document.querySelector('.popup');

        [].forEach.call(catalogies, item => catalogiesArray.push(item.innerHTML));
        if(id && catalogiesArray.indexOf(id.replace('-'," ")) === -1) {
            popup.removeAttribute('style');
            popup.classList.add('is-active');
            popup.scrollTo(0,0);
            document.body.setAttribute('style','overflow:hidden');
        }
    },[id])
    const closePopup = () => {
        let popup = document.querySelector('.popup');
        if(popup) {
            popup.classList.remove('is-active');
            setTimeout(() => {
                popup.setAttribute('style','display:none')
            },400)
            document.body.removeAttribute('style');
            const nextURL = window.location.href.replace(`/${id}`,"");
            const nextTitle = 'My new page title';
            const nextState = { additionalInformation: 'Updated the URL with JS' };
            window.history.pushState(nextState, nextTitle, nextURL);
        }
    }
    return (
        <div className="popup" style={{display:"none"}}>
            <Button value="" iconLeft="close" state="is-filled popup-close" onClick={() => {closePopup()}}/>
            <div className="popup-container">
                <section className="breakcrumb">
                    <h3>UI/ UX Design {id}</h3>
                    <hr></hr>
                </section>
                <section className="popup-content">
                    <h2>Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam</h2>
                    <div className="card-description">
                        <div className="description-time">
                            <span className="material-symbols-outlined">schedule</span>
                            <span>{ago}</span>
                        </div>
                        <Button value={"Save"} iconLeft="favorite" state="is-ghost" isSmall="true"/>
                        <Button value={"Share"} iconLeft="share" state="is-ghost" isSmall="true"/>
                    </div>
                    <h4>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet</h4>
                    <img src="https://d1j8r0kxyu9tj8.cloudfront.net/images/1561522880QGXUGEZbPy6CtAC.jpg" alt="post-image"/>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.</p>
                    <br/>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.</p>
                    <br/>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.</p>
                    <br/>
                    <p className="source">Source: <a href="http://www.statholdings.com" target={"_blank"}>http://www.statholdings.com</a></p>
                    <div className="post-comment">
                        <textarea rows={3} placeholder={"How do you think about this post?"}></textarea>
                        <Button value="Send" isSmall="true"/>
                        <h4>Comment</h4>
                        <div className="post-comment-item">
                            <img src="https://work.conando.vn/upload/220223/637812349690327647.jpg"  alt="user"/>
                            <div className="post-comment-item-content">
                                <p>Jane Cooper</p>
                                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus</span>
                            </div>
                        </div>
                        <div className="post-comment-item">
                            <img src="https://work.conando.vn/upload/220223/637812349690327647.jpg"  alt="user"/>
                            <div className="post-comment-item-content">
                                <p>Jane Cooper</p>
                                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus</span>
                            </div>
                        </div>
                        <div className="post-comment-item">
                            <img src="https://work.conando.vn/upload/220223/637812349690327647.jpg"  alt="user"/>
                            <div className="post-comment-item-content">
                                <p>Jane Cooper</p>
                                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus</span>
                            </div>
                        </div>
                        <Button value="More" state="is-ghost" isSmall="true"/>
                        <div className="related-news">
                            <section className="breakcrumb">
                                <h3>UI/ UX Design</h3>
                                <hr></hr>
                            </section>
                            <Card postID="post-020" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]} type=""/>
                            <Card postID="post-021" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]} type=""/>
                            <Card postID="post-022" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]} type=""/>
                        </div>
                        <hr></hr>
                    </div>
                </section>
            </div>
            <div className="popup-overlay"></div>
        </div>
    )
}