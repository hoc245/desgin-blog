import { set, onValue, ref, get } from "firebase/database";
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
  const [commentLoad, setCommentLoad] = useState(1);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(db, `/users/${user.uid}`), (snapshot) => {
          setUser(snapshot.val());
        });
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
    if (props.trigger) {
      let popup = document.querySelector(".popup");
      if (popup) {
        popup.removeAttribute("style");
        popup.scrollTo(0, 0);
        document.body.setAttribute("style", "overflow:hidden");
        setTimeout(() => {
          popup.classList.add("is-active");
        }, 0);
      }
    }
  }, [props.trigger, post]);
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
      document.body.setAttribute("style", "overflow:auto");
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
        .then(() => {
          document.body.setAttribute("style", "overflow:hidden");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      saveBtn.classList.add("is-invalid");
    }
  };
  const handleComment = (e) => {
    var text = e.currentTarget.previousSibling.value;
    if (text) {
      let time = new Date().getTime();
      set(ref(db, `/postDetail/${props.postID}/comments/${time}`), {
        id: time,
        creator: user,
        content: text,
      });
    }
  };
  console.log(post);
  const comments =
    post &&
    post.comments &&
    Object.keys(post.comments)
      .sort((a, b) => a - b)
      .splice((commentLoad - 1) * 5, 5);
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
          {post.creator ? (
            <div className="card-creator">
              <img src={post.creator.image} alt="avatar" />
              <p>{post.creator.name}</p>
            </div>
          ) : (
            <></>
          )}
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
            <Button
              value="Send"
              isSmall="true"
              onClick={(e) => {
                handleComment(e);
              }}
            />
            <h4>Comment</h4>
            {comments &&
              comments.map((item) => {
                return (
                  <div className="post-comment-item">
                    <img
                      src={post.comments[`${item}`].creator.image}
                      alt="user"
                    />
                    <div className="post-comment-item-content">
                      <p>
                        {`${post.comments[`${item}`].creator.name}`}
                        <li>{timeSince(item)}</li>
                      </p>
                      <span>{post.comments[`${item}`].content}</span>
                    </div>
                  </div>
                );
              })}
            <Button
              value="More"
              state="is-ghost"
              isSmall="true"
              onClick={() => {
                setCommentLoad(commentLoad + 1);
              }}
            />
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
