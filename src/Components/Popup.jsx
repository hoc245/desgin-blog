import { set, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
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
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);
  useEffect(() => {
    if (props.postID) {
      onValue(ref(db, `/postDetail/${props.postID}`), (snapshot) => {
        setPost(snapshot.val());
      });
    }
  }, [props.postID]);
  useEffect(() => {
    let popContent = document.querySelector(".popup-container");
    if (popContent) {
      popContent.scrollTo(0, 0);
    }
  }, [post]);
  const relatedPost =
    props.allPost && post
      ? Object.keys(props.allPost)
          .filter((item) => {
            if (
              props.allPost[`${item}`].catalogue === post.catalogue &&
              parseInt(item) !== parseInt(post.createAt)
            ) {
              return true;
            }
          })
          .sort((a, b) => {
            return b - a;
          })
          .splice(0, 5)
      : [];
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
      props.setTriggerPopup({
        trigger: false,
        id: "",
        allPost: props.allPost,
      });
    }, 200);
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
  const changePopupContent = (id) => {
    onValue(ref(db, `/postDetail/${id}`), (snapshot) => {
      setPost(snapshot.val());
    });
  };
  const handleSavePost = async (e, id) => {
    const savedPost = user && user.savedPost ? user.savedPost : {};
    const saveBtn = e.currentTarget;
    if (user) {
      saveBtn.classList.remove("is-invalid");
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
    } else {
      saveBtn.classList.add("is-invalid");
    }
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
          {post.creator ? 
          <div className="card-creator">
            <img src={post.creator.image} alt="avatar" />
            <p>{post.creator.name}</p>
          </div>
          : <></>}
          <h2>{post.title}</h2> 
          <div className="card-description">
            <div className="description-time">
              <span className="material-symbols-outlined">schedule</span>
              <span>{ago}</span>
            </div>
            <Button
              onClick={(e) => {
                handleSavePost(e, props.postID);
              }}
              value={`${
                user &&
                user.savedPost &&
                Object.keys(user.savedPost).indexOf(props.postID) !== -1
                  ? "Saved"
                  : "Save"
              }`}
              iconLeft={`${
                user &&
                user.savedPost &&
                Object.keys(user.savedPost).indexOf(props.postID) !== -1
                  ? "favorite"
                  : "favorite_border"
              }`}
              state={`${
                user &&
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
                <h3>Related Post</h3>
                <hr></hr>
              </section>
              {relatedPost &&
                relatedPost.map((post) => {
                  return (
                    <Card
                      key={`related${post}`}
                      setPostPopup={(e) => {
                        changePopupContent(e.id);
                      }}
                      user={props.user}
                      postID={post}
                      title={props.allPost[`${post}`].title}
                      description={props.allPost[`${post}`].description}
                      cover={props.allPost[`${post}`].image}
                      time={post}
                      tags={Object.keys(props.allPost[`${post}`].tags)}
                    />
                  );
                })}
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
