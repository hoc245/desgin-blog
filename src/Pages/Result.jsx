import React, { useEffect, useState } from "react";
import Card from "../Components/Card";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "../Components/Footer";
import Button from "../Components/Button";
import Popup from "../Components/Popup";
import { onValue, ref } from "firebase/database";
import { auth, db } from "../firebase";

export default function Result() {
  const location = useLocation();
  const param = useParams();
  const [page, setPage] = useState(1);
  const [currentCatalogue, setCurrentCatalogue] = useState();
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
  }, []);
  const [postPopup, setPostPopup] = useState({
    trigger: false,
    id: "",
    user: user,
  });
  const postPerPage = 10;
  useEffect(() => {
    onValue(ref(db, `/postThumb/`), (snapshot) => {
      setPostThumb(snapshot.val());
    });
    var current = location.pathname.substring(8).replace("-", " ");
    if (current.includes("UIUX")) {
      current = "UI/UX Design";
    }
    if (current.includes("Search")) {
      current = current.replace("Search&q=", "").replace("%20", " ");
    }
    if (current.includes("/") && !current.includes("UI/UX")) {
      current = current.substring(0, current.indexOf("/"));
    }
    setCurrentCatalogue(current);
    setPage(1);
  }, [location.pathname]);
  useEffect(() => {
    document.scrollingElement.scrollTo(0, 0);
  }, [page]);
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
    postThumb && currentCatalogue
      ? Object.keys(postThumb)
          .filter((item) => {
            if (currentCatalogue === "Latest") {
              return item;
            } else {
              if (
                Boolean(
                  currentCatalogue !== "Graphic Design" &&
                    currentCatalogue !== "UI/UX Design" &&
                    currentCatalogue !== "Saved"
                )
              ) {
                let result = currentCatalogue
                  .replace("Result for: ", "")
                  .split(" ");
                if (
                  result.every((v) => {
                    return postThumb[`${item}`].title
                      .toLowerCase()
                      .includes(v.toLowerCase());
                  })
                ) {
                  return item;
                }
              }
            }
            if (
              Boolean(
                currentCatalogue === "Graphic Design" ||
                  currentCatalogue === "UI/UX Design"
              ) &&
              postThumb[`${item}`].catalogue === currentCatalogue
            ) {
              return item;
            }
            if (currentCatalogue === "Saved") {
              if (
                user.savedPost &&
                Object.keys(user.savedPost).indexOf(item) >= 0
              ) {
                return item;
              }
            }
          })
          .sort((a, b) => {
            return b - a;
          })
          .splice((page - 1) * postPerPage, postPerPage)
      : [];

  const maxpage =
    postThumb && currentPost
      ? Math.floor(currentPost.length / postPerPage) +
        (currentPost.length % postPerPage !== 0 ? 1 : 0)
      : 1;
  const changePage = (e) => {
    const value = e.currentTarget.innerHTML;
    setPage(parseInt(value));
  };
  const nextPage = () => {
    if (page === maxpage) {
      return false;
    } else {
      setPage(page + 1);
    }
  };
  const prePage = () => {
    if (page === 1) {
      return false;
    } else {
      setPage(page - 1);
    }
  };
  return (
    <>
      <div className="main is-result">
        {/* <Hero /> */}
        <div className="main-content">
          <ul className="hero-section-catalogies">
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
            <Link
              className={`${
                param.id && param.id.includes("Graphic-Design")
                  ? "--catalogies-item is-active"
                  : "--catalogies-item"
              }`}
              to="/Result/Graphic-Design"
            >
              Graphic Design
            </Link>
            <Link
              className={`${
                param.id && param.id.includes("UIUX-Design")
                  ? "--catalogies-item is-active"
                  : "--catalogies-item"
              }`}
              to="/Result/UIUX-Design"
            >
              UI/UX Design
            </Link>
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
            <div className="searchbar">
              <input
                type={"text"}
                className="search"
                placeholder="Tiêu đề bài viết"
                defaultValue={currentSearch}
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
          </section>
          <section className="card-container result">
            {currentPost.length ? (
              currentPost.map((post) => {
                return (
                  <Card
                    key={`${post}`}
                    user={user}
                    setPostPopup={setPostPopup}
                    postID={post}
                    title={postThumb[`${post}`].title}
                    description={postThumb[`${post}`].description}
                    cover={postThumb[`${post}`].image}
                    time={post}
                    tags={Object.keys(postThumb[`${post}`].tags)}
                  />
                );
              })
            ) : (
              <p className="no-result">No matching results were found</p>
            )}
            <ul className="pagination">
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
                        className="pagination-item"
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
                              className="pagination-item"
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
                                className="pagination-item"
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
                      <li className="pagination-item">...</li>
                      <li
                        className="pagination-item"
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
            </ul>
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
