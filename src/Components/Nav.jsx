import React from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "./Button";
import logo from "../Images/logo.png"

export default function Nav({loginState, user}) {
    let location = useLocation();
    window.addEventListener('scroll',() => {
        let nav = document.querySelector('.nav');
        if(document.documentElement.scrollTop === 0) {
            nav.classList.remove('is-scroll')
        } else {
            nav.classList.add('is-scroll');
        }
    })
    return(
        <nav className='nav'>
            <div className="nav-container">
                <div className="nav-left">
                    <Link className={"logo"} to="/"><img src={logo} alt="logo"/></Link>
                    <Link className={"nav-item " + `${!location.pathname.includes("Course") ? "is-active" : ""}`} to="/Homepage">News</Link>
                    <Link className={"nav-item " + `${location.pathname.includes("Course") ? "is-active" : ""}`} to="/Course">Courses</Link>
                    <div className="nav-dropdown">
                        <div className="nav-dropdown-title">Catalogies</div>
                        <ul className="nav-dropdown-menu">
                            <Link className={`${location.pathname.includes("Homepage") ? "nav-dropdown-menu-item is-active" : "nav-dropdown-menu-item"}`} to="/Homepage">All</Link>
                            <Link className={`${location.pathname.includes("Lastest") ? "nav-dropdown-menu-item is-active" : "nav-dropdown-menu-item"}`} to="/Result/Lastest">Lastest</Link>
                            <Link className={`${location.pathname.includes("Graphic-Design") ? "nav-dropdown-menu-item is-active" : "nav-dropdown-menu-item"}`} to="/Result/Graphic-Design">Graphic Design</Link>
                            <Link className={`${location.pathname.includes("UIUX-Design") ? "nav-dropdown-menu-item is-active" : "nav-dropdown-menu-item"}`} to="/Result/UIUX-Design">UI/UX Design</Link>
                            <Link className={`${location.pathname.includes("Saved") ? "nav-dropdown-menu-item is-active" : "nav-dropdown-menu-item"}`} to="/Result/Saved">Saved</Link>
                        </ul>
                    </div>
                </div>
                <>
                    {!loginState ? 
                        <div className="nav-right">
                            <Button value={"Create a post"} iconLeft="add" state="is-outline"/>
                            <Link to={"/About"} ><Button value={"Giới thiệu"} state={"is-ghost"}/></Link>
                            <Button value={"Đăng nhập"}/>
                        </div> : 
                        <div className="nav-right">
                            <Button value={"Create a post"} iconLeft="add" state="is-outline"/>
                            <Link to={"/About"} ><Button value={"Giới thiệu"} state={"is-ghost"}/></Link>
                            <div className="nav-user">
                                <img src={`${user && user.image}`} alt="user-image"/>
                                <ul className="nav-user-dropdown">
                                    <li className="--dropdown-item"><Link to="/saved">Đã lưu</Link></li>
                                    <li className="--dropdown-item">Tài khoản</li>
                                    <li className="--dropdown-item">Đăng xuất</li>
                                </ul>
                            </div>
                        </div>
                    }
                </>
            </div>
        </nav>
    )
}