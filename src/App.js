import './Styles/CSS/App.css';
import React, { useEffect , useState } from "react";
import {auth, db} from './firebase';
import Nav from './Components/Nav';
import { Outlet, useLocation } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import 'react-quill/dist/quill.snow.css';
import CreatePost from './Components/CreatePost';
import { onValue, ref } from 'firebase/database';

function App() {
  const location = useLocation();
  const [hasLogin, setHasLogin] = useState(false);
  const [createPost,setCreatePost] = useState(false);
  const [user,setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user && localStorage.getItem('saveLogin')) {
        setHasLogin(true);
        onValue(ref(db,`/users/${user.uid}`),snapshot => {
          setUser(snapshot.val())
        })
      } else {
        setHasLogin(false);
      }
    })
  },[])
  return (
    <div className="App">
      <Nav loginState={hasLogin} user={user}  triggerPopup={setCreatePost}/>
      {location.pathname === "/" && <Homepage />}
      {location.pathname === "/design-blog" && <Homepage />}
      <Outlet />
      <CreatePost trigger={createPost} setCreatePost={setCreatePost}/>
    </div>
  );
}

export default App;