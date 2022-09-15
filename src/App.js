import jwt_decode from "jwt-decode";
import "./Styles/CSS/App.css";
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import Nav from "./Components/Nav";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import CreatePost from "./Components/CreatePost";
import { onValue, ref } from "firebase/database";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function App() {
  const location = useLocation();
  const [hasLogin, setHasLogin] = useState(false);
  const [createPost, setCreatePost] = useState(false);
  const [user, setUser] = useState();
  const [catalogue, setCatalogue] = useState();

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
  }, []);
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
        setCreatePost={setCreatePost}
      />
    </div>
  );
}

export default App;
