import React, { useEffect, useState } from "react";
import Card from "../Components/Card";
import Hero from "../Components/Hero";
import { useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import Button from "../Components/Button";

export default function Result() {
    const location = useLocation();
    const [page,setPage] = useState(1);
    const maxpage = 10;
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
                <section className="breakcrumb">
                    <h3>{location.pathname.includes('Search') ? `Result for: ${current}` : `${current}`}</h3>
                    <hr></hr>
                </section>
                <section className="card-container result">
                    <Card postID="post-002" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]}/>
                    <Card postID="post-002" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]}/>
                    <Card postID="post-002" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]}/>
                    <Card postID="post-002" title="Tiềm năng phát triển của ngành UI/ UX Design tại Việt Nam" description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia mollit nonconsequat duis enim velit mollit. Exercita veniam consequat sunt nostrud amet ..." cover="" time="09/02/2022" tags={["Lastest","UI/UX"]}/>
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
                            <li className="pagination-item" onClick={(e) => {changePage(e)}}>...</li>
                            <li className="pagination-item" onClick={(e) => {changePage(e)}}>{maxpage}</li>
                        </>}
                    </>}
                    <Button value="" iconRight="arrow_right" state="is-ghost" onClick={() => {nextPage()}}/>
                </ul>
                </section>
            </div>
            <Footer />
        </>
    )
}