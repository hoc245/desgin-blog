import { ref, remove } from "firebase/database";
import React, { useEffect } from "react";
import { db } from "../firebase";
import Button from "./Button";

export default function ConfirmPopup(props) {
  useEffect(() => {
    if (props.trigger) {
      let popup = document.querySelector(".popup.is-confirm");
      popup.removeAttribute("style");
      popup.scrollTo(0, 0);
      document.body.setAttribute("style", "overflow:hidden");
      setTimeout(() => {
        popup.classList.add("is-active");
      }, 0);
    } else {
      document.body.setAttribute("style", "overflow:auto");
    }
  }, [props.trigger]);

  const closePopup = () => {
    let popup = document.querySelector(".popup.is-confirm");
    popup.classList.remove("is-active");
    setTimeout(() => {
      props.setTriggerPopup({
        trigger: false,
        id: "",
      });
    }, 200);
  };
  const deletePost = async (id) => {
    await remove(ref(db, `/postThumb/${id}`))
      .then(() => {
        remove(ref(db, `/postDetail/${id}`));
      })
      .then(() => {
        closePopup();
      });
  };
  return props.trigger ? (
    <div className="popup is-confirm" style={{ display: "none" }}>
      <Button
        value=""
        iconLeft="close"
        state="is-filled popup-close"
        onClick={() => {
          closePopup();
        }}
      />
      <div className="popup-container">
        <section className="popup-title">
          <h2>Confirm</h2>
        </section>
        <section>
          <p>
            You are requesting to delete the post, are you sure you want to do
            it?
          </p>
        </section>
        <section>
          <Button
            value={"Delete"}
            iconLeft={"delete"}
            state="is-filled"
            onClick={() => deletePost(props.postID)}
          />
          <Button
            value={"Cancel"}
            iconLeft={"close"}
            state="is-ghost"
            onClick={() => closePopup()}
          />
        </section>
      </div>
      <div className="popup-overlay"></div>
    </div>
  ) : (
    <></>
  );
}
