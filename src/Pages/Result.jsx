import React, { useEffect, useState } from "react";
import Card from "../Components/Card";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "../Components/Footer";
import Button from "../Components/Button";
import Popup from "../Components/Popup";
import { onValue, ref } from "firebase/database";
import { auth, db } from "../firebase";
import loadMore from "../Components/loadMore";

function getDayName(dateStr) {
  var date = new Date(parseInt(dateStr));
  return date.toLocaleDateString("en-EN", { weekday: "long" });
}
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(date) {
  var day = new Date(parseInt(date));
  return [
    padTo2Digits(day.getDate()),
    padTo2Digits(day.getMonth() + 1),
    day.getFullYear(),
  ].join("/");
}

export default function Result() {
  const location = useLocation();
  const param = useParams();
  const [page, setPage] = useState(1);
  const [currentCatalogue, setCurrentCatalogue] = useState();
  const [catalogue, setCatalogue] = useState();
  const [postThumb, setPostThumb] = useState();
  const [currentSearch, setCurrentSearch] = useState("");
  const navigate = useNavigate();
  const handleSearch = (e) => {
    const input = e.currentTarget.previousSibling;
    const value = input.value;
    if (value === "") {
      return false;
    } else {
      navigate(`/Result/Search&q=${value}`);
    }
    setCurrentSearch(value);
  };
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user && localStorage.getItem("saveLogin")) {
        onValue(ref(db, `/users/${user.uid}`), (snapshot) => {
          setUser(snapshot.val());
        });
      }
    });
    setCatalogue(JSON.parse(localStorage.getItem("catalogue")));
  }, []);
  const [postPopup, setPostPopup] = useState({
    trigger: false,
    id: "",
    user: user,
  });
  useEffect(() => {
    window.addEventListener("scroll", loadContent);
    return function cleanUp() {
      window.removeEventListener("scroll", loadContent);
    };
  });
  const postPerPage = 10;
  useEffect(() => {
    onValue(ref(db, `/postThumb/`), (snapshot) => {
      setPostThumb(snapshot.val());
    });
    var current = location.pathname
      .substring(8)
      .replace("Search&q=", "")
      .replace("-", " ")
      .replace("%20", " ")
      .replace(".", "/");
    setCurrentCatalogue(current);
    setPage(1);
    if (!location.pathname.includes("Search")) {
      setCurrentSearch("");
    }
    document.scrollingElement.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    const pages = document.querySelectorAll(".pagination-item");
    if (pages) {
      [].forEach.call(pages, (item) => {
        if (parseInt(item.innerHTML) === page) {
          item.classList.add("is-active");
        } else {
          item.classList.remove("is-active");
        }
      });
    }
  });
  const currentPost =
    postThumb && currentCatalogue && catalogue
      ? Object.keys(postThumb)
          .filter((item) => {
            if (currentCatalogue === "Latest") {
              return item;
            }
            if (currentCatalogue === "Saved") {
              if (
                user &&
                user.savedPost &&
                Object.keys(user.savedPost).indexOf(item) >= 0
              ) {
                return item;
              }
            }
            if (catalogue.indexOf(currentCatalogue) === -1) {
              let result = currentCatalogue
                .replace("Search&q=", "")
                .replace("%20", " ")
                .toLowerCase()
                .split(" ");
              if (
                result.some((v) => {
                  return postThumb[`${item}`].title.toLowerCase().includes(v);
                })
              ) {
                return item;
              }
            }
            if (
              catalogue.indexOf(currentCatalogue) !== -1 &&
              postThumb[`${item}`].catalogue === currentCatalogue
            ) {
              return item;
            }
          })
          .sort((a, b) => {
            return b - a;
          })
          .splice(0, postPerPage * page)
      : [];

  // const maxpage =
  //   postThumb && currentPost
  //     ? Math.floor(currentPost.length / postPerPage) +
  //       (currentPost.length % postPerPage !== 0 ? 1 : 0)
  //     : 1;
  // const changePage = (e) => {
  //   const value = e.currentTarget.innerHTML;
  //   setPage(parseInt(value));
  // };
  const loadContent = () => {
    let current = page;
    let next = loadMore(current);
    if (next) {
      setPage(next);
    } else {
      return false;
    }
  };

  return (
    <>
      <div className="main is-result">
        {/* <Hero /> */}
        <div className="main-content">
          <ul className="hero-section-catalogies">
            <div className="hero-section-catalogies-menu">
              <Link
                className={`${
                  param.id && param.id.includes("Homepage")
                    ? "--catalogies-item is-active"
                    : "--catalogies-item"
                }`}
                to="/Homepage"
              >
                All
              </Link>
              <Link
                className={`${
                  param.id && param.id.includes("Latest")
                    ? "--catalogies-item is-active"
                    : "--catalogies-item"
                }`}
                to="/Result/Latest"
              >
                Latest
              </Link>
              {catalogue &&
                catalogue.map((cata) => {
                  return (
                    <Link
                      className={`${
                        param.id &&
                        param.id.includes(
                          cata.replace(" ", "-").replace("/", ".")
                        )
                          ? "--catalogies-item is-active"
                          : "--catalogies-item"
                      }`}
                      to={`/Result/${cata.replace(" ", "-").replace("/", ".")}`}
                    >
                      {cata}
                    </Link>
                  );
                })}
              <Link
                className={`${
                  param.id && param.id.includes("Saved")
                    ? "--catalogies-item is-active"
                    : "--catalogies-item"
                }`}
                to="/Result/Saved"
              >
                Saved
              </Link>
            </div>
            <div
              className={
                catalogue && catalogue.length >= 3
                  ? "searchbar is-collapse"
                  : "searchbar"
              }
            >
              <input
                type={"text"}
                className="search"
                placeholder="Tiêu đề bài viết"
                value={currentSearch}
                onChange={(e) => setCurrentSearch(e.currentTarget.value)}
              />
              <Button
                value="Search"
                iconRight="search"
                state="is-filled"
                onClick={(e) => {
                  handleSearch(e);
                }}
              />
            </div>
          </ul>
          <section className="breakcrumb">
            <h3>
              {location.pathname.includes("Search")
                ? `Result for: ${currentCatalogue}`
                : `${currentCatalogue}`}
            </h3>
            <hr></hr>
            {currentCatalogue === "Latest" ? (
              <span>{`${getDayName(currentPost[0])}, ${formatDate(
                currentPost[0]
              )}`}</span>
            ) : (
              <></>
            )}
          </section>
          <section className="card-container result">
            {currentPost.length ? (
              currentPost.map((post) => {
                return (
                  <Card
                    key={`${post}`}
                    user={user}
                    creator={
                      postThumb[`${post}`].creator
                        ? postThumb[`${post}`].creator
                        : null
                    }
                    setPostPopup={setPostPopup}
                    postID={post}
                    title={postThumb[`${post}`].title}
                    description={postThumb[`${post}`].description}
                    cover={postThumb[`${post}`].image}
                    time={post}
                    tags={postThumb[`${post}`].tags}
                  />
                );
              })
            ) : (
              <p className="no-result">No matching results were found</p>
            )}
            {/* <ul className="pagination">
              <Button
                value=""
                iconLeft="arrow_left"
                state="is-ghost"
                onClick={() => {
                  prePage();
                }}
              />
              {maxpage <= 5 ? (
                <>
                  {Array.from(Array(5), (_e, i) => {
                    return (
                      <li
                        className={
                          page === i + 1
                            ? "pagination-item is-active"
                            : "pagination-item"
                        }
                        onClick={(e) => {
                          changePage(e);
                        }}
                      >
                        {i + 1}
                      </li>
                    );
                  })}
                </>
              ) : (
                <>
                  {page >= maxpage - 3 ? (
                    <>
                      {Array.from(Array(maxpage), (_e, i) => {
                        if (i >= maxpage - 5 && i <= maxpage) {
                          return (
                            <li
                              key={`page-${i}`}
                              className={
                                page === i + 1
                                  ? "pagination-item is-active"
                                  : "pagination-item"
                              }
                              onClick={(e) => {
                                changePage(e);
                              }}
                            >
                              {i + 1}
                            </li>
                          );
                        }
                      })}
                    </>
                  ) : (
                    <>
                      {Array.from(
                        Array(page === 1 ? page + 2 : page + 1),
                        (_e, i) => {
                          if (i > page - 3) {
                            return (
                              <li
                                key={`page-${i}`}
                                className={
                                  page === i + 1
                                    ? "pagination-item is-active"
                                    : "pagination-item"
                                }
                                onClick={(e) => {
                                  changePage(e);
                                }}
                              >
                                {i + 1}
                              </li>
                            );
                          }
                        }
                      )}
                      <li className={"pagination-item"}>...</li>
                      <li
                        className={
                          page === maxpage
                            ? "pagination-item is-active"
                            : "pagination-item"
                        }
                        onClick={(e) => {
                          changePage(e);
                        }}
                      >
                        {maxpage}
                      </li>
                    </>
                  )}
                </>
              )}
              <Button
                value=""
                iconRight="arrow_right"
                state="is-ghost"
                onClick={() => {
                  nextPage();
                }}
              />
            </ul> */}
          </section>
        </div>
      </div>
      <Popup
        trigger={postPopup.trigger}
        postID={postPopup.id}
        allPost={postThumb}
        user={postPopup.user}
        setTriggerPopup={setPostPopup}
      />
      <Footer />
    </>
  );
}
