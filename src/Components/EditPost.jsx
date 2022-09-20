import React, { useEffect, useState } from "react";
import Button from "./Button";
import CustomeDaypicker from "./CustomeDaypicker";
import imageCompression from "browser-image-compression";
import { auth, db, storage } from "../firebase";
import Editor from "./Editor";
import { set, ref, onValue } from "firebase/database";
import "react-quill/dist/quill.snow.css";
import "react-day-picker/dist/style.css";
import Tags from "./Tags";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { ref as sRef } from "@firebase/storage";

function convertTime(e) {
  let currentSelectDay = "";
  let mm = "";
  let dd = "";
  if (e) {
    mm = e.getMonth() + 1; // Months start at 0!
    dd = e.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    currentSelectDay = dd + "/" + mm + "/" + e.getFullYear();
  } else {
    currentSelectDay = "Select a day";
  }
  return currentSelectDay;
}

export default function EditPost(props) {
  const postDetail = props.postDetail;
  let options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  let value = postDetail.body;
  const userList = props.userList;
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
      ".popup.edit-post .dropdown-catalogies-title-value"
    );
    catalogue.innerHTML = value;
    document
      .querySelector(".popup.edit-post .dropdown-catalogies-menu")
      .classList.toggle("is-active");
  };
  const closePopup = () => {
    let popup = document.querySelector(".create-post");
    popup.classList.remove("is-active");
    setTimeout(() => {
      props.setCreatePost({
        id: "",
        trigger: false,
        postDetail: {},
      });
    }, 200);
  };
  const newPost = async () => {
    const catalogies = document.querySelector(
      ".popup.edit-post .dropdown-catalogies-title-value"
    ).innerHTML;
    const source = document.querySelector(
      ".popup.edit-post .post-create-source input"
    ).value;
    var tags = {};
    let selectedTags = document.querySelectorAll(
      ".popup.edit-post .tag.is-selected"
    );
    [].forEach.call(selectedTags, (item) => {
      tags[`${item.innerHTML.replace("/", "-")}`] = true;
    });
    const image = "";
    const title = document.querySelector(
      ".popup.edit-post .post-content-header"
    ).value;
    const subTitle = document.querySelector(
      ".popup.edit-post .post-content-sub"
    ).value;
    const body = value;
    const creator = document
      .querySelector(
        ".popup.edit-post .post-creator .dropdown-catalogies-title-value"
      )
      .getAttribute("data-id");
    const valid = checkValid();
    const createBtn = document.querySelector(
      ".popup.edit-post .button.create-post"
    );
    var mPost = {
      createAt: postDetail.createAt,
      catalogue: "",
      source: "",
      tags: "",
      image: "",
      title: "",
      description: "",
      body: "",
      creator: {},
    };
    mPost[`catalogue`] = catalogies;
    mPost[`source`] = source;
    mPost[`tags`] = tags;
    mPost[`image`] = image;
    mPost[`title`] = title;
    mPost[`description`] = subTitle;
    mPost[`body`] = body;
    mPost[`creator`] = userList[`${creator}`];
    if (valid) {
      console.log("valid");
      let [file] = document.querySelector(
        '.popup.edit-post input[id="banner-upload"]'
      ).files;
      createBtn.classList.add("is-loading");
      if (!file) {
        mPost.image = document.querySelector(
          ".popup.edit-post .post-banner-link input"
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
              ".popup.edit-post .button.create-post .button-value"
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
                  creator: mPost.creator,
                });
                set(ref(db, `/postDetail/${mPost.createAt}`), mPost);
              })
              .then(() => {
                createBtn.classList.remove("is-loading");
                createBtn.classList.add("is-success");
                document.querySelector(
                  ".popup.edit-post .button.create-post .button-value"
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
    const validText = document.querySelector(
      ".popup.edit-post .post-action-valid"
    );
    const createAt = document.querySelector(
      ".popup.edit-post .post-create-day--value"
    ).innerHTML;
    const catalogies = document.querySelector(
      ".popup.edit-post .dropdown-catalogies-title-value"
    ).innerHTML;
    var tags = {};
    let selectedTags = document.querySelectorAll(
      ".popup.edit-post .tag.is-selected"
    );
    [].forEach.call(selectedTags, (item) => {
      tags[`${item.innerHTML.replace("/", "-")}`] = true;
    });
    const image = document.querySelector(
      ".popup.edit-post .post-banner-preview img"
    ).src;
    const title = document.querySelector(
      ".popup.edit-post .post-content-header"
    ).value;
    const body = value;
    const imageLink = document.querySelector(
      ".popup.edit-post .post-banner-link input"
    ).value;
    // Container
    const daypickerSection = document.querySelector(
      ".popup.edit-post .post-create-day"
    );
    const catalogiesSection = document.querySelector(
      ".popup.edit-post .post-catalogies"
    );
    const tagsSection = document.querySelector(".popup.edit-post .post-tags");
    const bannerSection = document.querySelector(
      ".popup.edit-post .post-banner"
    );
    const contentSection = document.querySelector(
      ".popup.edit-post .post-content"
    );
    const creator = document.querySelector(".popup.edit-post .post-creator");
    const creatorID = document
      .querySelector(
        ".popup.edit-post .post-creator .dropdown-catalogies-title-value"
      )
      .getAttribute("data-id");
    if (createAt === "Select a day") {
      daypickerSection.classList.add("is-invalid");
      console.log(`Error at: daypickerSection`);
    } else {
      daypickerSection.classList.remove("is-invalid");
    }
    if (!creatorID) {
      creator.classList.add("is-invalid");
      console.log(`Error at: creator`);
    } else {
      creator.classList.remove("is-invalid");
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
      ".popup.edit-post .post-banner-preview img"
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
      ".popup.edit-post .post-create-day--value"
    );
    let value = current.innerHTML;
    if (value !== e) {
      current.innerHTML = e;
    } else {
      current.innerHTML = "Select a day";
    }
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
  const handleCreator = (id) => {
    const catalogue = document.querySelector(
      ".popup.edit-post .post-creator .dropdown-catalogies-title-value"
    );
    catalogue.setAttribute("data-id", id);
    catalogue.innerHTML = userList[`${id}`].name;
    document
      .querySelector(".popup.edit-post .post-creator .dropdown-catalogies-menu")
      .classList.toggle("is-active");
  };
  return props.trigger && postDetail ? (
    <>
      {postDetail ? (
        <>
          <div className="create-post popup edit-post">
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
                        {postDetail.catalogue}
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
                  <h3>Create at (Required)</h3>
                  <p
                    className="post-create-day--value"
                    onClick={(e) => {
                      e.currentTarget.nextSibling.classList.toggle("is-active");
                    }}
                  >
                    {convertTime(new Date(postDetail.createAt))}
                  </p>
                  <CustomeDaypicker
                    value={postDetail.createAt}
                    callback={(e) => {
                      handleDaypicker(e);
                    }}
                  />
                </div>
                <div className="post-create-source">
                  <h3>Source (optional)</h3>
                  <input
                    type={"text"}
                    placeholder={"Link to post source"}
                    defaultValue={postDetail.source}
                  />
                </div>
                <Tags tags={postDetail.tags} />
                {props.userList[`${auth.currentUser.uid}`] &&
                  props.userList[`${auth.currentUser.uid}`].role ===
                    "admin" && (
                    <div className="post-creator">
                      <h3>Creator (Required)</h3>
                      <div className="dropdown-catalogies">
                        <div
                          className="dropdown-catalogies-title"
                          onClick={(e) => {
                            e.currentTarget.nextSibling.classList.toggle(
                              "is-active"
                            );
                          }}
                        >
                          <span
                            className="dropdown-catalogies-title-value"
                            data-id={
                              postDetail.creator ? postDetail.creator.id : ""
                            }
                          >
                            {postDetail.creator.name
                              ? postDetail.creator.name
                              : "Choose a creator"}
                          </span>
                          <span class="material-symbols-outlined">
                            navigate_next
                          </span>
                        </div>
                        <div className="dropdown-catalogies-menu">
                          {props.userList &&
                            Object.keys(userList).map((user) => {
                              return (
                                <div
                                  className="dropdown-catalogies-item"
                                  onClick={() => handleCreator(user)}
                                >
                                  <img
                                    src={userList[`${user}`].image}
                                    alt="avatar"
                                  />
                                  <p>{userList[`${user}`].name}</p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  )}
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
                  <img src={postDetail.image} alt="preview" />
                </div>
                <div className="post-banner-link">
                  <h3>or Paste your link here</h3>
                  <input
                    type={"text"}
                    placeholder={"Banner link"}
                    defaultValue={postDetail.image}
                  />
                </div>
              </section>
              <section className="post-content">
                <h3>Title (Required)</h3>
                <textarea
                  className="post-content-header"
                  rows={3}
                  defaultValue={postDetail.title}
                  onChange={(e) => {
                    handleTitle(e);
                  }}
                  maxLength={160}
                ></textarea>
                <h3>Sub-title</h3>
                <textarea
                  className="post-content-sub"
                  rows={3}
                  defaultValue={postDetail.description}
                  onChange={(e) => {
                    handleSubTitle(e);
                  }}
                  maxLength={160}
                ></textarea>
                <h3>Main (Required)</h3>
                <Editor
                  value={postDetail.body}
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
                  value={"Update post"}
                  iconLeft="check"
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
