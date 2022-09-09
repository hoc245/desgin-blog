import './Styles/CSS/App.css';
import React, { useEffect , useState } from "react";
import {auth, db} from './firebase';
import Nav from './Components/Nav';
import { Outlet, useLocation , Route, Routes } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import Popup from './Components/Popup';

function App() {
  const location = useLocation();
  const [hasLogin, setHasLogin] = useState(false);
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user) {
        setHasLogin(true);
      } else {
        setHasLogin(false);
      }
    })
  })

  return (
    <div className="App">
      <Nav loginState={hasLogin}/>
      {location.pathname === "/" && <Homepage />}
      <Outlet />
      <Popup />
    </div>
  );
}

export default App;
