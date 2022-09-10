import React, { useEffect, useState } from "react";
import Card from "../Components/Card";
import Hero from "../Components/Hero";
import { useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import Button from "../Components/Button";
import Popup from "../Components/Popup";
import { onValue, ref } from "firebase/database";
import { db } from "../firebase";

export default function Result() {
    const location = useLocation();
    const [page,setPage] = useState(1);
    const [currentCatalogue,setCurrentCatalogue] = useState();
    const [postThumb,setPostThumb] = useState();
    const maxpage = 10;
    const [postPopup,setPostPopup] = useState({
        trigger : false,
        id : ""
    })
    var current = ""
    useEffect(() => {
        onValue(ref(db, `/postThumb/`),snapshot => {
            setPostThumb(snapshot.val())
        });
        var current = location.pathname.substring(8).replace('-',' ');
        if(current.includes("UIUX")) {
            current = "UI/UX Design"
        }
        if(current.includes('Search')) {
            current = current.replace('Search&q=',"")
        }
        if(current.includes('/') && !current.includes("UI/UX")) {
            current = current.substring(0,current.indexOf('/'))
        }
        setCurrentCatalogue(current);
    },[location.pathname]);
    useEffect(() => {
        const pages = document.querySelectorAll('.pagination-item');
        if(pages) {
            [].forEach.call(pages, item => {
                if(parseInt(item.innerHTML) === page) {
                    item.classList.add('is-active');
                } else {
                    item.classList.remove('is-active')
                }
            })
        }
    })
    const currentPost = postThumb && currentCatalogue ? Object.keys(postThumb).filter(item => {
        if(currentCatalogue === "Lastest") {
            return true
        } else {
            if(postThumb[`${item}`].catalogue.indexOf(currentCatalogue) !== -1) {
                return true
            }
        }
    }).sort((a,b) => {return b - a}).splice((page-1)*4,4) : [];
    const changePage = (e) => {
        const value = e.currentTarget.innerHTML;
        setPage(parseInt(value));
    }
    const nextPage = () => {
        if(page === maxpage) {
            return false 
        } else {
            setPage(page + 1);
        }
    }
    const prePage = () => {
        if(page === 1) {
            return false
        } else {
            setPage(page - 1);
        }
    }
    return (
        <>
            <div className="main">
                <Hero />
                <div className="main-content">
                    <section className="breakcrumb">
                        <h3>{location.pathname.includes('Search') ? `Result for: ${currentCatalogue}` : `${currentCatalogue}`}</h3>
                        <hr></hr>
                    </section>
                    <section className="card-container result">
                        {postThumb && currentPost.map(post => {
                            return <Card setPostPopup={setPostPopup} postID={post} title={postThumb[`${post}`].title} description={postThumb[`${post}`].description} cover={postThumb[`${post}`].image} time={post} tags={Object.keys(postThumb[`${post}`].tags)}/>
                        })}
                    <ul className="pagination">
                        <Button value="" iconLeft="arrow_left" state="is-ghost" onClick={() => {prePage()}}/>
                        {maxpage <= 5 ? 
                        <>
                            {Array.from(Array(5), (e,i) => {
                                return <li className="pagination-item" onClick={(e) => {changePage(e)}}>{i + 1}</li>
                            })}
                        </>
                        : 
                        <>
                            {page >= maxpage - 3 ? 
                            <>
                                {Array.from(Array(maxpage), (e,i) => {
                                    if(i >= maxpage - 5 && i <= maxpage) {
                                        return <li key={`page-${i}`} className="pagination-item" onClick={(e) => {changePage(e)}}>{i + 1}</li>
                                    }
                                })}
                            </>
                            : 
                            <>
                                {Array.from(Array(page === 1 ? page + 2 : page + 1), (e,i) => {
                                    if(i > page - 3) {
                                        return <li key={`page-${i}`} className="pagination-item" onClick={(e) => {changePage(e)}}>{i + 1}</li>
                                    }
                                })}
                                <li className="pagination-item" >...</li>
                                <li className="pagination-item" onClick={(e) => {changePage(e)}}>{maxpage}</li>
                            </>}
                        </>}
                        <Button value="" iconRight="arrow_right" state="is-ghost" onClick={() => {nextPage()}}/>
                    </ul>
                    </section>
                </div>
            </div>
            <Popup trigger={postPopup.trigger} postID={postPopup.id} setTriggerPopup={setPostPopup}/>
            <Footer />
        </>
    )
}