import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../Components/Button";

export default function Hero(props) {
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
        {props.catalogue &&
          props.catalogue.map((cata) => {
            return (
              <Link
                className={`${
                  param.id &&
                  param.id.includes(
                    cata.cata.replace(" ", "-").replace("/", ".")
                  )
                    ? "--catalogies-item is-active"
                    : "--catalogies-item"
                }`}
                to={`/Result/${cata.replace(" ", "-").replace("/", ".")}`}
                onClick={() => {
                  clearSearch();
                }}
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
          onClick={() => {
            clearSearch();
          }}
        >
          Saved
        </Link>
      </ul>
      <h1>C???p nh???t tin t???c n??ng h???i</h1>
      <p>Ch??ng t??i mong mu???n mang ?????n cho b???n ngu???n tin n??ng v?? b??? ??ch nh???t</p>
      <div className="searchbar">
        <input
          type={"text"}
          className="search"
          placeholder="Ti??u ????? b??i vi???t"
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
