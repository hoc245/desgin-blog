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
  const [hasLogin, setHaslogin] = useState(false);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setHaslogin(true);
      }
    });
  }, []);
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
    let toolbar = editor.querySelector(".ql-toolbar");
    if (!editor) {
      return false;
    } else {
      let y = editor.getBoundingClientRect().y;
      if (y < 95) {
        toolbar.classList.add("is-sticky");
      } else {
        toolbar.classList.remove("is-sticky");
      }
    }
  };
  const handleCatalogue = (e) => {
    const value = e.currentTarget.innerHTML;
    const catalogue = document.querySelector(
      ".dropdown-catalogies-title-value"
    );
    if (value === catalogue.innerHTML) {
      catalogue.innerHTML = "Choose catalogue";
    } else {
      catalogue.innerHTML = value;
    }
    document
      .querySelector(".dropdown-catalogies-menu")
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
      ".post-create-day--value"
    ).innerHTML;
    const catalogies = document.querySelector(
      ".dropdown-catalogies-title-value"
    ).innerHTML;
    const source = document.querySelector(".post-create-source input").value;
    var tags = {};
    let selectedTags = document.querySelectorAll(".tag.is-selected");
    [].forEach.call(selectedTags, (item) => {
      tags[`${item.innerHTML.replace("/", "-")}`] = true;
    });
    const image = "";
    const title = document.querySelector(".post-content-header").value;
    const subTitle = document.querySelector(".post-content-sub").value;
    const body = value;
    const valid = checkValid();
    var mPost = {
      createAt: "",
      catalogue: "",
      source: "",
      tags: "",
      image: "",
      title: "",
      description: "",
      body: "",
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
      let [file] = document.querySelector('input[id="banner-upload"]').files;
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
              closePopup();
            });
        });
      });
    } else {
      console.log("invalid");
      console.log("something went wrong");
    }
  };
  const checkValid = () => {
    const createAt = document.querySelector(
      ".post-create-day--value"
    ).innerHTML;
    const catalogies = document.querySelector(
      ".dropdown-catalogies-title-value"
    ).innerHTML;
    var tags = {};
    let selectedTags = document.querySelectorAll(".tag.is-selected");
    [].forEach.call(selectedTags, (item) => {
      tags[`${item.innerHTML.replace("/", "-")}`] = true;
    });
    const image = document.querySelector(".post-banner-preview img").src;
    const title = document.querySelector(".post-content-header").value;
    const body = value;
    // Container
    const daypickerSection = document.querySelector(".post-create-day");
    const catalogiesSection = document.querySelector(".post-catalogies");
    const tagsSection = document.querySelector(".post-tags");
    const bannerSection = document.querySelector(".post-banner");
    const contentSection = document.querySelector(".post-content");
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
      console.log(tags);
      tagsSection.classList.add("is-invalid");
      console.log(`Error at: tagsSection`);
    } else {
      tagsSection.classList.remove("is-invalid");
    }
    if (!image || image === "") {
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
      return false;
    } else {
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
    const preview = document.querySelector(".post-banner-preview img");
    if (file) {
      await imageCompression(file, options).then((compressFile) => {
        preview.src = URL.createObjectURL(compressFile);
        preview.setAttribute("alt", fileName);
      });
    }
  };
  const handleDaypicker = (e) => {
    let current = document.querySelector(".post-create-day--value");
    let value = current.innerHTML;
    if (value !== e) {
      current.innerHTML = e;
    } else {
      current.innerHTML = "Select a day";
    }
  };
  return props.trigger ? (
    <>
      {hasLogin ? (
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
                  <h3>Catalogue</h3>
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
                      <p
                        className="dropdown-catalogies-item"
                        onClick={(e) => {
                          handleCatalogue(e);
                        }}
                      >
                        Graphic Design
                      </p>
                      <p
                        className="dropdown-catalogies-item"
                        onClick={(e) => {
                          handleCatalogue(e);
                        }}
                      >
                        UI/UX Design
                      </p>
                    </div>
                  </div>
                </div>
                <div className="post-create-day">
                  <h3>Create at</h3>
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
                <h3>Banner</h3>
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
              </section>
              <section className="post-content">
                <h3>Title</h3>
                <textarea className="post-content-header" rows={1}></textarea>
                <h3>Sub-title</h3>
                <textarea className="post-content-sub" rows={3}></textarea>
                <h3>Main</h3>
                <Editor
                  sendValue={(e) => {
                    value = e;
                  }}
                />
              </section>
              <section className="post-action">
                <Button
                  value={"Create post"}
                  iconLeft="add"
                  onClick={() => newPost()}
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
