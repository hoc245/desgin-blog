import { set, onValue, ref, update } from "firebase/database";
import React, { useEffect } from "react";
import { useState } from "react";
import Button from "../Components/Button";
import { auth, db, storage } from "../firebase";
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";
import imageCompression from "browser-image-compression";
import { getDownloadURL } from "firebase/storage";
import { ref as sRef, uploadBytes } from "@firebase/storage";
import { async } from "@firebase/util";

function Account() {
  const [user, setUser] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const userEdited = user ? user : {};
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user && localStorage.getItem("saveLogin")) {
        onValue(ref(db, `/users/${user.uid}`), (snapshot) => {
          setUser(snapshot.val());
        });
      }
    });
  }, []);
  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };
  const saveProfile = async () => {
    let currentPassword = document.getElementById("user-password").value;
    let newpassword = document.getElementById("user-repassword").value;
    let valid = checkValid();
    if (valid === true) {
      if (currentPassword && newpassword) {
        updatePass(currentPassword, newpassword);
      }
      await updateProfileFirebase();
      await updateDatabase();
      setIsEdit(false);
    } else {
      setIsEdit(false);
    }
  };
  const updatePass = (password, newpassword) => {
    var credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    );
    if (credential) {
      updatePassword(auth.currentUser.email, newpassword).catch((error) =>
        console.log(error)
      );
    }
  };
  const updateProfileFirebase = () => {
    updateProfile(auth.currentUser, {
      displayName: userEdited.name,
      email: userEdited.email,
      photoURL: userEdited.image,
    });
  };
  const updateDatabase = () => {
    update(ref(db, `/users/${userEdited.id}`), userEdited);
  };
  const handleName = (e) => {
    userEdited.name = e.currentTarget.value;
  };
  const handleJob = (e) => {
    userEdited.jobs = e.currentTarget.value;
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
    const preview = document.querySelector(".account-image img");
    let imageRef = sRef(storage, `images/${fileName}.${file.name.substr(-3)}`);
    if (file) {
      await imageCompression(file, options).then((compressFile) => {
        preview.src = URL.createObjectURL(compressFile);
        preview.setAttribute("alt", fileName);
        uploadBytes(imageRef, compressFile).then(() => {
          getDownloadURL(
            sRef(storage, `images/${fileName}.${file.name.substr(-3)}`)
          ).then((url) => {
            userEdited.image = url;
            updateDatabase();
          });
        });
      });
    }
  };
  const checkValid = () => {
    let name = document.querySelector('label[for="user-name"]');
    let job = document.querySelector('label[for="user-job"]');
    let password = document.querySelector('label[for="user-password"]');
    let newpassword = document.querySelector('label[for="user-repassword"]');
    let validNoti = document.querySelector(".account-valid");
    if (!name.firstChild.value) {
      name.classList.add("is-invalid");
    } else {
      name.classList.remove("is-invalid");
    }
    if (!job.firstChild.value) {
      job.classList.add("is-invalid");
    } else {
      job.classList.remove("is-invalid");
    }
    if (password.firstChild.value !== newpassword.firstChild.value) {
      password.classList.add("is-invalid");
      newpassword.classList.add("is-invalid");
      validNoti.classList.add("is-active");
    } else {
      password.classList.remove("is-invalid");
      newpassword.classList.remove("is-invalid");
      validNoti.classList.remove("is-active");
    }
    let invalid = document.querySelectorAll("label.is-invalid");
    if (invalid.length) {
      return false;
    } else {
      return true;
    }
  };
  const handleImage = async (filename) => {
    let [file] = document.querySelector(
      'input[id="account-image-upload"]'
    ).files;
    let imageRef = sRef(storage, `images/${filename}.${file.name.substr(-3)}`);
    return new Promise((res, rej) => {
      uploadBytes(imageRef, file).then(() => {
        getDownloadURL(
          sRef(storage, `images/${filename}.${file.name.substr(-3)}`)
        ).then((url) => {
          userEdited.image = url;
        });
      });
      res(true);
      rej(false);
    });
  };
  return user ? (
    <div className="main account">
      <div className="main-content">
        <section className="breakcrumb">
          <h3>Account</h3>
          <hr></hr>
        </section>
        <section className="account-info">
          <div className="account-image">
            <label htmlFor="account-image-upload">
              <Button
                value="Upload"
                iconLeft={"add_photo_alternate"}
                state="is-ghost"
              />
              <input
                id="account-image-upload"
                type="file"
                accept={"image/png, image/gif, image/jpeg"}
                name="filename"
                onChange={(e) => handleFile(e)}
              />
            </label>
            <img src={user.image} alt="preview" />
          </div>
          <div className="account-detail">
            <h3>Email</h3>
            <label htmlFor="user-email">
              <input id="user-email" type="email" value={user.email} readOnly />
            </label>
            <h3>Display Name</h3>
            <label htmlFor="user-name">
              <input
                id="user-name"
                type="text"
                defaultValue={user.name}
                onChange={(e) => {
                  handleName(e);
                }}
                readOnly={!isEdit}
              />
            </label>
            <h3>Jobs</h3>
            <label htmlFor="user-job">
              <input
                id="user-job"
                type="text"
                defaultValue={user.jobs}
                onChange={(e) => {
                  handleJob(e);
                }}
                readOnly={!isEdit}
              />
            </label>
            <h3>Password</h3>
            <label htmlFor="user-password">
              <input
                id="user-password"
                type="password"
                placeholder="Your password"
                readOnly={!isEdit}
              />
            </label>
            {isEdit && (
              <>
                <h3>New password</h3>
                <label htmlFor="user-repassword">
                  <input
                    id="user-repassword"
                    type="password"
                    placeholder="Your password"
                    readOnly={!isEdit}
                  />
                </label>
              </>
            )}
            <h3 className="account-valid">
              The current password and the new password cannot be the same
            </h3>
            <div className="account-action">
              {!isEdit && (
                <Button
                  value={isEdit ? "Save" : "Edit"}
                  iconLeft={isEdit ? "Check" : "edit"}
                  state={isEdit ? "is-filled is-saved" : "is-filled"}
                  onClick={() => {
                    toggleEdit();
                  }}
                />
              )}
              {isEdit && (
                <Button
                  value={"Save"}
                  iconLeft="check"
                  state="is-filled is-saved"
                  onClick={() => {
                    saveProfile();
                  }}
                />
              )}
              {isEdit && (
                <Button
                  value={"Cancel"}
                  iconLeft="close"
                  state="is-ghost"
                  onClick={() => {
                    setIsEdit(false);
                  }}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default Account;
