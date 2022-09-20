import "./Styles/CSS/App.css";
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import Nav from "./Components/Nav";
import { Outlet, useLocation } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import CreatePost from "./Components/CreatePost";
import { onValue, ref } from "firebase/database";
import Button from "./Components/Button";

function App() {
  const location = useLocation();
  const [hasLogin, setHasLogin] = useState(false);
  const [createPost, setCreatePost] = useState(false);
  const [user, setUser] = useState();
  const [catalogue, setCatalogue] = useState();
  const [tags, setTags] = useState();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user && localStorage.getItem("saveLogin")) {
        setHasLogin(true);
        onValue(ref(db, `/users/${user.uid}`), (snapshot) => {
          setUser(snapshot.val());
        });
      } else {
        setHasLogin(false);
      }
    });
    onValue(ref(db, `/catalogue/`), (snapshot) => {
      if (snapshot) {
        setCatalogue(snapshot.val());
        localStorage.setItem("catalogue", JSON.stringify(snapshot.val()));
      }
    });
    onValue(ref(db, `/tags/`), (snapshot) => {
      if (snapshot) {
        setTags(snapshot.val());
        localStorage.setItem("tags", JSON.stringify(snapshot.val()));
      }
    });
  }, []);
  const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, c - c / 8);
    }
  };
  return (
    <div className="App">
      <Nav
        loginState={hasLogin}
        user={user}
        catalogue={catalogue ? catalogue : null}
        triggerPopup={setCreatePost}
      />
      {location &&
      Boolean(location.pathname === "" || location.pathname === "/") ? (
        <Homepage />
      ) : (
        <></>
      )}
      <Outlet />
      <CreatePost
        trigger={createPost}
        hasLogin={hasLogin}
        catalogue={catalogue ? catalogue : null}
        tags={tags ? tags : null}
        setCreatePost={setCreatePost}
      />
      <Button
        iconLeft={"arrow_upward"}
        state={"is-filled scroll-top"}
        onClick={() => {
          scrollToTop();
        }}
      />
    </div>
  );
}

export default App;
