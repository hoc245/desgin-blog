import { get, onValue, ref, remove } from "firebase/database";
import React, { useState } from "react";
import { useEffect } from "react";
import Button from "../Components/Button";
import ConfirmPopup from "../Components/ConfirmPopup";
import EditPost from "../Components/EditPost";
import Setting from "../Components/Setting";
import { auth, db } from "../firebase";

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

function PostManagement(props) {
  const [userList, setUserList] = useState();
  const [user, setUser] = useState();
  const [postList, setPostList] = useState();
  const [isConfirm, setIsConfirm] = useState({
    trigger: false,
    id: "",
  });
  const [isSetting, setIsSetting] = useState(false);
  const [search, setSearch] = useState("");
  const [catalogue, setCatalogue] = useState();
  const [currentCatalogue, setCurrentCatalogue] = useState("All catalogies");
  const [page, setPage] = useState(props.page ? props.page : 1);
  const [postDetail, setPostDetail] = useState({
    id: "",
    trigger: false,
    postDetail: {},
  });
  const postPerPage = 10;
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(db, `/users`), (snapshot) => {
          setUserList(snapshot.val());
        });
        onValue(ref(db, `/users/${user.uid}`), (snapshot) => {
          setUser(snapshot.val());
        });
        onValue(ref(db, `/postThumb`), (snapshot) => {
          setPostList(snapshot.val());
        });
      }
    });
    onValue(ref(db, `/catalogue/`), (snapshot) => {
      setCatalogue(snapshot.val());
    });
  }, []);
  useEffect(() => {
    document.scrollingElement.scrollTo(0, 0);
  }, [page]);
  const maxpage =
    postList && Object.keys(postList)
      ? Math.floor(Object.keys(postList).length / postPerPage) +
        (Object.keys(postList).length % postPerPage !== 0 ? 1 : 0)
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
  const goToPostDetail = async (id) => {
    await get(ref(db, `/postDetail/${id}`)).then((res) => {
      setPostDetail({
        id: id,
        trigger: true,
        postDetail: res.val(),
      });
    });
  };
  const currentPostList =
    postList &&
    Object.keys(postList)
      .filter((item) => {
        if (user && user.role === "admin") {
          return item;
        }
        if (
          postList[`${item}`].creator &&
          postList[`${item}`].creator === user.id
        ) {
          return item;
        }
      })
      .filter((item) => {
        if (currentCatalogue === "All catalogies") {
          return item;
        }
        if (postList[`${item}`].catalogue === currentCatalogue) {
          return item;
        }
      })
      .filter((item) => {
        if (search === "") {
          return item;
        } else {
          let result = search.toLowerCase().split(" ");
          if (
            result.every((v) => {
              return postList[`${item}`].title.toLowerCase().includes(v);
            })
          ) {
            return item;
          }
        }
      });
  const deletePost = async (id) => {
    setIsConfirm({
      trigger: true,
      id: id,
    });
  };
  const handleCatalogue = (e) => {
    const value = e.currentTarget.innerHTML;
    document
      .querySelector(".dropdown-catalogies-menu")
      .classList.toggle("is-active");
    setCurrentCatalogue(value);
  };
  const handleSearch = (e) => {
    const input = e.currentTarget.previousSibling;
    const value = input.value;
    setSearch(value);
  };
  return (
    <>
      <div className="main account">
        <div className="main-content">
          <section className="breakcrumb">
            <h3>Post management</h3>
            <hr></hr>
            <p className="indicator">
              <p>{`Total posts: ${
                postList && Object.keys(postList).length
              }`}</p>
            </p>
          </section>
          <div className="account-toolbar">
            <div className="post-catalogies">
              <div className="dropdown-catalogies">
                <div
                  className="dropdown-catalogies-title"
                  onClick={(e) => {
                    e.currentTarget.nextSibling.classList.toggle("is-active");
                  }}
                >
                  <span className="dropdown-catalogies-title-value">
                    {currentCatalogue}
                  </span>
                  <span class="material-symbols-outlined">navigate_next</span>
                </div>
                <div className="dropdown-catalogies-menu">
                  <p
                    className="dropdown-catalogies-item"
                    onClick={(e) => {
                      handleCatalogue(e);
                    }}
                  >
                    All catalogies
                  </p>
                  {catalogue &&
                    catalogue.map((cata) => {
                      return (
                        <p
                          className="dropdown-catalogies-item"
                          onClick={(e) => {
                            handleCatalogue(e);
                          }}
                        >
                          {cata}
                        </p>
                      );
                    })}
                </div>
              </div>
            </div>
            <div className="searchbar">
              <input
                type={"text"}
                className="search"
                placeholder="Tiêu đề bài viết"
                defaultValue={search}
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
            <Button
              value={"Settings"}
              iconLeft={"settings"}
              state={"is-ghost"}
              onClick={() => {
                setIsSetting(true);
              }}
            />
          </div>
          {user && userList ? (
            <section className="post-container">
              {postList &&
                currentPostList
                  .splice((page - 1) * postPerPage, postPerPage)
                  .map((post) => {
                    return (
                      <div key={post} className="post-item">
                        <img
                          src={postList[`${post}`].image}
                          alt={postList[`${post}`].title}
                        />
                        <div className="post-detail">
                          <h3 className="post-title">
                            {postList[`${post}`].title}
                          </h3>
                          <h4
                            className="post-description"
                            title={postList[`${post}`].description}
                          >
                            {postList[`${post}`].description}
                          </h4>
                        </div>
                        {postList[`${post}`].creator && (
                          <div className="post-creator">
                            <img
                              src={postList[`${post}`].creator.image}
                              alt="avatar"
                            />
                            <p>{postList[`${post}`].creator.name}</p>
                          </div>
                        )}
                        <p className="post-createAt">{`${getDayName(
                          post
                        )}, ${formatDate(post)}`}</p>
                        <div className="post-action">
                          <Button
                            value="Edit"
                            iconLeft="Edit"
                            isSmall={true}
                            state="is-outline"
                            onClick={() => {
                              goToPostDetail(post);
                            }}
                          />
                          <Button
                            value="Delete"
                            iconLeft="Delete"
                            isSmall={true}
                            state="is-ghost"
                            onClick={() => {
                              deletePost(post);
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
            </section>
          ) : (
            <></>
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
          </ul>
        </div>
      </div>
      <EditPost
        trigger={postDetail.trigger}
        userList={userList}
        postID={postDetail.id}
        postDetail={postDetail.postDetail}
        setCreatePost={setPostDetail}
      />
      <ConfirmPopup
        trigger={isConfirm.trigger}
        postID={isConfirm.id}
        setTriggerPopup={setIsConfirm}
      />
      <Setting
        trigger={isSetting}
        postList={postList}
        setTriggerPopup={setIsSetting}
      />
    </>
  );
}

export default PostManagement;
