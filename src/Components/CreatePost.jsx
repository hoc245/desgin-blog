import React, { useEffect, useState } from "react";
import Button from "./Button";
import CustomeDaypicker from "./CustomeDaypicker";
import imageCompression from "browser-image-compression";
import { auth, db, storage } from "../firebase";
import Editor from "./Editor";
import { set, ref } from "firebase/database";
import "react-quill/dist/quill.snow.css";
import "react-day-picker/dist/style.css";
import Tags from "./Tags";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { ref as sRef } from "@firebase/storage";

export default function CreatePost(props) {
  const catalogue = props.catalogue;
  let options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  let value = "";
  useEffect(() => {
    if (props.trigger) {
      let popup = document.querySelector(".create-post");
      let editor = document.querySelector(".popup-container");
      if (editor) {
        editor.addEventListener("scroll", () => {
          stickyEditor();
        });
      }
      document.body.style.overflow = "hidden";
      popup.classList.add("is-active");
    } else {
      document.body.style.overflow = "auto";
    }
  });
  const stickyEditor = () => {
    let editor = document.querySelector(".quill");
    if (!editor) {
      return false;
    } else {
      let y = editor.getBoundingClientRect().y;
      if (y < 95) {
        editor.classList.add("is-sticky");
      } else {
        editor.classList.remove("is-sticky");
      }
    }
  };
  const handleCatalogue = (e) => {
    const value = e.currentTarget.innerHTML;
    const catalogue = document.querySelector(
      ".create-post .dropdown-catalogies-title-value"
    );
    catalogue.innerHTML = value;
    document
      .querySelector(".create-post .dropdown-catalogies-menu")
      .classList.toggle("is-active");
  };
  const closePopup = () => {
    let popup = document.querySelector(".create-post");
    popup.classList.remove("is-active");
    setTimeout(() => {
      props.setCreatePost(false);
    }, 200);
  };
  const newPost = async () => {
    const createAt = document.querySelector(
      ".create-post .post-create-day--value"
    ).innerHTML;
    const catalogies = document.querySelector(
      ".create-post .dropdown-catalogies-title-value"
    ).innerHTML;
    const source = document.querySelector(
      ".create-post .post-create-source input"
    ).value;
    var tags = {};
    let selectedTags = document.querySelectorAll(
      ".create-post .tag.is-selected"
    );
    [].forEach.call(selectedTags, (item) => {
      tags[`${item.innerHTML.replace("/", "-")}`] = true;
    });
    const image = "";
    const title = document.querySelector(
      ".create-post .post-content-header"
    ).value;
    const subTitle = document.querySelector(
      ".create-post .post-content-sub"
    ).value;
    const body = value;
    const valid = checkValid();
    const createBtn = document.querySelector(
      ".create-post .button.create-post"
    );
    var mPost = {
      createAt: "",
      catalogue: "",
      source: "",
      tags: "",
      image: "",
      title: "",
      description: "",
      body: "",
      creator: auth.currentUser.uid,
    };
    let current = new Date();
    mPost[`createAt`] = new Date(
      `${createAt
        .split("/")
        .reverse()
        .join(
          "/"
        )} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}:${current.getMilliseconds()}`
    ).getTime();
    mPost[`catalogue`] = catalogies;
    mPost[`source`] = source;
    mPost[`tags`] = tags;
    mPost[`image`] = image;
    mPost[`title`] = title;
    mPost[`description`] = subTitle;
    mPost[`body`] = body;
    if (valid) {
      console.log("valid");
      let [file] = document.querySelector(
        '.create-post input[id="banner-upload"]'
      ).files;
      createBtn.classList.add("is-loading");
      if (!file) {
        mPost.image = document.querySelector(
          ".create-post .post-banner-link input"
        ).value;
        await set(ref(db, `/postDetail/${mPost.createAt}`), mPost)
          .then(() => {
            set(ref(db, `/postThumb/${mPost.createAt}`), {
              catalogue: mPost.catalogue,
              description: mPost.description,
              image: mPost.image,
              tags: mPost.tags,
              title: mPost.title,
              creator: mPost.creator,
            });
          })
          .then(() => {
            createBtn.classList.remove("is-loading");
            createBtn.classList.add("is-success");
            document.querySelector(
              ".create-post .button.create-post .button-value"
            ).innerHTML = "Post created successfully";
            setTimeout(() => {
              closePopup();
            }, 2000);
          });
      } else {
        let fileName = mPost.createAt;
        let imageRef = sRef(
          storage,
          `images/${fileName}.${file.name.substr(-3)}`
        );
        await imageCompression(file, options).then((compressFile) => {
          uploadBytes(imageRef, compressFile).then(() => {
            getDownloadURL(
              sRef(storage, `images/${fileName}.${file.name.substr(-3)}`)
            )
              .then((url) => {
                mPost.image = url;
              })
              .then(() => {
                set(ref(db, `/postThumb/${mPost.createAt}`), {
                  catalogue: mPost.catalogue,
                  description: mPost.description,
                  image: mPost.image,
                  tags: mPost.tags,
                  title: mPost.title,
                });
                set(ref(db, `/postDetail/${mPost.createAt}`), mPost);
              })
              .then(() => {
                createBtn.classList.remove("is-loading");
                createBtn.classList.add("is-success");
                document.querySelector(
                  ".create-post .button.create-post .button-value"
                ).innerHTML = "Post created successfully";
                setTimeout(() => {
                  closePopup();
                }, 2000);
              });
          });
        });
      }
    } else {
      console.log("invalid");
      console.log("something went wrong");
    }
  };
  const checkValid = () => {
    const validText = document.querySelector(".create-post .post-action-valid");
    const createAt = document.querySelector(
      ".create-post .post-create-day--value"
    ).innerHTML;
    const catalogies = document.querySelector(
      ".create-post .dropdown-catalogies-title-value"
    ).innerHTML;
    var tags = {};
    let selectedTags = document.querySelectorAll(
      ".create-post .tag.is-selected"
    );
    [].forEach.call(selectedTags, (item) => {
      tags[`${item.innerHTML.replace("/", "-")}`] = true;
    });
    const image = document.querySelector(
      ".create-post .post-banner-preview img"
    ).src;
    const title = document.querySelector(
      ".create-post .post-content-header"
    ).value;
    const body = value;
    const imageLink = document.querySelector(
      ".create-post .post-banner-link input"
    ).value;
    // Container
    const daypickerSection = document.querySelector(
      ".create-post .post-create-day"
    );
    const catalogiesSection = document.querySelector(
      ".create-post .post-catalogies"
    );
    const tagsSection = document.querySelector(".create-post .post-tags");
    const bannerSection = document.querySelector(".create-post .post-banner");
    const contentSection = document.querySelector(".create-post .post-content");
    if (createAt === "Select a day") {
      daypickerSection.classList.add("is-invalid");
      console.log(`Error at: daypickerSection`);
    } else {
      daypickerSection.classList.remove("is-invalid");
    }
    if (catalogies === "") {
      catalogiesSection.classList.add("is-invalid");
      console.log(`Error at: catalogiesSection`);
    } else {
      catalogiesSection.classList.remove("is-invalid");
    }
    if (!Object.keys(tags).length) {
      tagsSection.classList.add("is-invalid");
      console.log(`Error at: tagsSection`);
    } else {
      tagsSection.classList.remove("is-invalid");
    }
    if (Boolean(!image && !imageLink)) {
      bannerSection.classList.add("is-invalid");
    } else {
      bannerSection.classList.remove("is-invalid");
    }
    if (title === "" || body === "") {
      contentSection.classList.add("is-invalid");
      console.log(`Error at: contentSection`);
    } else {
      contentSection.classList.remove("is-invalid");
    }
    const invalid = document.querySelectorAll(".is-invalid");
    if (invalid.length) {
      validText.classList.add("is-active");
      return false;
    } else {
      validText.classList.remove("is-active");
      return true;
    }
  };
  const handleFile = async (e) => {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const [file] = await e.currentTarget.files;
    const time = new Date();
    const fileName = `${time.getTime()}${file.name}`;
    const preview = document.querySelector(
      ".create-post .post-banner-preview img"
    );
    if (file) {
      await imageCompression(file, options).then((compressFile) => {
        preview.src = URL.createObjectURL(compressFile);
        preview.setAttribute("alt", fileName);
      });
    }
  };
  const handleDaypicker = (e) => {
    let current = document.querySelector(
      ".create-post .post-create-day--value"
    );
    current.innerHTML = e;
  };
  const handleTitle = (e) => {
    const title = e.currentTarget.previousSibling;
    const value = e.currentTarget.value;
    title.innerHTML = `Title (Required) <span>${value.length}/160 characters</span>`;
    if (value.length <= e.currentTarget.getAttribute("maxlength")) {
      return true;
    } else {
      return false;
    }
  };
  const handleSubTitle = (e) => {
    const title = e.currentTarget.previousSibling;
    const value = e.currentTarget.value;
    title.innerHTML = `Sub-title <span>${value.length}/160 characters</span>`;
    if (value.length <= e.currentTarget.getAttribute("maxlength")) {
      return true;
    } else {
      return false;
    }
  };
  return props.trigger ? (
    <>
      {props.hasLogin ? (
        <>
          <div className="create-post popup">
            <Button
              iconLeft="close"
              state="is-filled popup-close"
              onClick={() => {
                closePopup();
              }}
            />
            <div className="popup-container">
              <section className="popup-title">
                <h2>Create post</h2>
              </section>
              <section className="post-option">
                <div className="post-catalogies">
                  <h3>Catalogue (Required)</h3>
                  <div className="dropdown-catalogies">
                    <div
                      className="dropdown-catalogies-title"
                      onClick={(e) => {
                        e.currentTarget.nextSibling.classList.toggle(
                          "is-active"
                        );
                      }}
                    >
                      <span className="dropdown-catalogies-title-value">
                        Choose catalogue
                      </span>
                      <span class="material-symbols-outlined">
                        navigate_next
                      </span>
                    </div>
                    <div className="dropdown-catalogies-menu">
                      {catalogue &&
                        catalogue.map((cata) => {
                          return (
                            <p
                              className="dropdown-catalogies-item"
                              onClick={(e) => {
                                handleCatalogue(e);
                              }}
                            >
                              {cata}
                            </p>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="post-create-day">
                  <h3>Create at (Required)</h3>
                  <p
                    className="post-create-day--value"
                    onClick={(e) => {
                      e.currentTarget.nextSibling.classList.toggle("is-active");
                    }}
                  >
                    Select a day
                  </p>
                  <CustomeDaypicker
                    callback={(e) => {
                      handleDaypicker(e);
                    }}
                  />
                </div>
                <div className="post-create-source">
                  <h3>Source (optional)</h3>
                  <input type={"text"} placeholder={"Link to post source"} />
                </div>
                <Tags />
              </section>
              <section className="post-banner">
                <h3>Banner (Required)</h3>
                <div className="post-banner-preview">
                  <label htmlFor="banner-upload">
                    <Button value="Upload" iconLeft={"add_photo_alternate"} />
                    <input
                      id="banner-upload"
                      type="file"
                      accept={"image/png, image/gif, image/jpeg"}
                      name="filename"
                      onChange={(e) => handleFile(e)}
                    />
                  </label>
                  <img src="" alt="preview" />
                </div>
                <div className="post-banner-link">
                  <h3>or Paste your link here</h3>
                  <input type={"text"} placeholder={"Banner link"} />
                </div>
              </section>
              <section className="post-content">
                <h3>Title (Required)</h3>
                <textarea
                  className="post-content-header"
                  rows={3}
                  onChange={(e) => {
                    handleTitle(e);
                  }}
                  maxLength={160}
                ></textarea>
                <h3>Sub-title</h3>
                <textarea
                  className="post-content-sub"
                  rows={3}
                  onChange={(e) => {
                    handleSubTitle(e);
                  }}
                  maxLength={160}
                ></textarea>
                <h3>Main (Required)</h3>
                <Editor
                  sendValue={(e) => {
                    value = e;
                  }}
                />
              </section>
              <section className="post-action">
                <p className="post-action-valid">
                  You need to fill some fields before create a post
                </p>
                <Button
                  value={"Create post"}
                  iconLeft="add"
                  onClick={() => newPost()}
                  state="is-filled create-post"
                />
                <Button
                  value={"Cancel"}
                  iconLeft="remove"
                  state="is-ghost"
                  onClick={() => {
                    closePopup();
                  }}
                />
              </section>
            </div>
            <div className="popup-overlay"></div>
          </div>
        </>
      ) : (
        <>
          <div
            className="create-post popup"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Button
              iconLeft="close"
              state="is-filled popup-close"
              onClick={() => {
                closePopup();
              }}
            />
            <div className="popup-container">
              <section className="popup-title">
                <h2 style={{ "text-align": "center", width: "100%" }}>
                  Sign in to create a post
                </h2>
              </section>
              <section>
                <img
                  style={{ height: "300px" }}
                  src="https://i.pinimg.com/originals/65/dc/a6/65dca69f78972935caf61580e7c17bd9.png"
                  alt=""
                />
              </section>
            </div>
            <div className="popup-overlay"></div>
          </div>
        </>
      )}
    </>
  ) : (
    <></>
  );
}
