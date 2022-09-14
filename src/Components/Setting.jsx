import { ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Button from "./Button";

function Setting(props) {
  const [newCatalogue, setNewcatalogue] = useState(null);
  const [createNew, setCreateNew] = useState(false);
  useEffect(() => {
    if (props.trigger) {
      setNewcatalogue(props.catalogue);
    }
  }, [props.trigger, props.catalogue]);
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
      props.setTriggerPopup(false);
    }, 200);
  };
  const removeCatalogue = (index, item) => {
    let invalid = document.querySelector(".popup.is-confirm .is-invalid");
    let valid = checkValid(item);
    valid.then((res) => {
      if (res) {
        invalid.innerHTML = `Your current catalogue has: ${res} post(s)</br>Please remove these post(s) before delete catalogue!`;
        invalid.classList.add("is-active");
      } else {
        invalid.classList.remove("is-active");
        setNewcatalogue(newCatalogue.splice(index, 1));
      }
    });
  };
  const updateCatalogue = async () => {
    let invalid = document.querySelector(
      ".popup.is-confirm .is-invalid.is-active"
    );
    if (invalid) {
      return false;
    } else {
      console.log(newCatalogue);
      set(ref(db, `/catalogue`), newCatalogue);
    }
  };
  const checkValid = (cata) => {
    let postList = props.postList;
    let less = 0;
    return new Promise((res, rej) => {
      Object.keys(postList).map((post, index) => {
        if (postList[`${post}`].catalogue === cata) {
          less = less + 1;
        }
      });
      res(less);
    });
  };
  const addCatalogue = (e) => {
    const value = e.currentTarget.previousSibling.value;
    if (value) {
      newCatalogue[`${Object.keys(newCatalogue).length}`] = value;
      setNewcatalogue(newCatalogue);
      setCreateNew(false);
    } else {
      setCreateNew(false);
    }
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
          <h2>Catalogies Settings</h2>
        </section>
        <section className="catalogue-settings">
          {newCatalogue &&
            newCatalogue.map((item) => {
              return (
                <div key={`settings-${item}`} className="catalogue-item">
                  <p>{item}</p>
                  <Button
                    value={"Delete"}
                    iconLeft={"delete"}
                    state="is-outline"
                    isSmall={true}
                    onClick={() =>
                      removeCatalogue(newCatalogue.indexOf(item), item)
                    }
                  />
                </div>
              );
            })}
          {createNew && (
            <div className="catalogue-item">
              <input placeholder="Catalogue title" />
              <Button
                value={"Update"}
                iconLeft={"check"}
                state="is-outline"
                isSmall={true}
                onClick={(e) => addCatalogue(e)}
              />
            </div>
          )}
        </section>
        <p className="is-invalid">""</p>
        <section>
          <Button
            value={"Update"}
            iconLeft={"check"}
            state="is-filled"
            onClick={() => updateCatalogue()}
          />
          <Button
            value={"Cancel"}
            iconLeft={"close"}
            state="is-ghost"
            onClick={() => closePopup()}
          />
          <Button
            value={"Add"}
            iconLeft={"add"}
            state="is-ghost popup-add"
            onClick={() => setCreateNew(true)}
          />
        </section>
      </div>
      <div className="popup-overlay"></div>
    </div>
  ) : (
    <></>
  );
}

export default Setting;
