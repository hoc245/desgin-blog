import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../Components/Button";

export default function Hero() {
  const [currentSearch, setCurrentSearch] = useState("");
  const param = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (param.id && param.id.includes("Search")) {
      setCurrentSearch(
        param.id.replace("-", " ").replace("Search&q=", "").replace("%20", " ")
      );
    }
  }, [param]);
  const handleSearch = (e) => {
    const input = e.currentTarget.previousSibling;
    const value = input.value;
    console.log();
    if (value === "") {
      return false;
    } else {
      navigate(`/Result/Search&q=${value}`);
    }
  };
  const clearSearch = () => {
    document.scrollingElement.scrollTo(0, 0);
    setCurrentSearch("");
  };
  return (
    <section className="hero-section">
      <ul className="hero-section-catalogies">
        <Link
          className={`${
            param.id && param.id.includes("Homepage")
              ? "--catalogies-item is-active"
              : "--catalogies-item"
          }`}
          to="/Homepage"
          onClick={() => {
            clearSearch();
          }}
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
          onClick={() => {
            clearSearch();
          }}
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
          onClick={() => {
            clearSearch();
          }}
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
          onClick={() => {
            clearSearch();
          }}
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
          onClick={() => {
            clearSearch();
          }}
        >
          Saved
        </Link>
      </ul>
      <h1>Cập nhật tin tức nóng hổi</h1>
      <p>Chúng tôi mong muốn mang đến cho bạn nguồn tin nóng và bổ ích nhất</p>
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
      <div className="overlay"></div>
    </section>
  );
}
