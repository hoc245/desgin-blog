import { onValue, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import hexToHSL from "./HEXtoHSL";

function randomHEX() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

function Tags(props) {
  const [currentTags, setCurrentTags] = useState([]);
  const [tags, setTags] = useState();
  const [newTags, setNewTags] = useState("");
  const [randomColor, setRandomColor] = useState(randomHEX());
  useEffect(() => {
    onValue(ref(db, `/tags`), (snapshot) => {
      if (snapshot) {
        setTags(snapshot.val());
      }
    });
  }, []);
  useEffect(() => {
    if (props.tags) {
      setCurrentTags(props.tags);
    }
  }, [props.tags]);
  const addTag = (e) => {
    if (currentTags.length === 3) {
      return false;
    } else {
      const value = e.currentTarget.innerHTML;
      const input = document.querySelector(".tags-input");
      const mArray =
        currentTags && currentTags.length > 0 ? currentTags.slice() : [];
      const allTags = document.querySelectorAll(".post-tags-suggestion .tag");
      const exist = tags.some((ele) => {
        if (ele.value === value) {
          return true;
        } else {
          return false;
        }
      });
      if (exist) {
        if (mArray === [] || mArray === null || mArray.indexOf(value) === -1) {
          mArray.push({
            value: value,
            color: e.currentTarget.getAttribute("data-color"),
          });
          console.log(mArray);
          setCurrentTags(mArray);
          input.value = "";
          [].forEach.call(allTags, (tag) => {
            tag.classList.remove("is-active");
          });
        }
      } else {
        let newTagArray = tags;
        newTagArray.push({
          value: value,
          color: "#" + randomColor,
        });
        console.log(newTagArray);
        set(ref(db, `/tags`), newTagArray).then(() => {
          setCurrentTags(newTagArray);
          input.value = "";
          [].forEach.call(allTags, (tag) => {
            tag.classList.remove("is-active");
          });
          setNewTags("");
          setRandomColor(randomHEX());
        });
      }
    }
  };
  const removeTag = (e) => {
    const mArray = currentTags.slice();
    const value = e.currentTarget.innerHTML ? e.currentTarget.innerHTML : "";
    mArray.splice(mArray.indexOf(value), 1);
    setCurrentTags(mArray);
  };
  const tagsSuggestion = (e) => {
    const value = e.currentTarget.value;
    const tags = document.querySelectorAll(".post-tags-suggestion .tag");
    [].forEach.call(tags, (tag) => {
      if (value) {
        if (!tag.innerHTML.toLowerCase().includes(value.toLowerCase())) {
          tag.classList.remove("is-active");
        } else {
          tag.classList.add("is-active");
        }
      } else {
        tag.classList.add("is-active");
      }
    });
    if (
      !document.querySelectorAll(
        ".post-tags-suggestion .tag:not(.is-new-tag).is-active"
      ).length
    ) {
      setNewTags(value);
    } else {
      setNewTags("");
    }
  };
  const showSuggestion = (e, val) => {
    const allTags = document.querySelectorAll(".post-tags-suggestion .tag");
    if (val) {
      [].forEach.call(allTags, (tag) => {
        tag.classList.add("is-active");
      });
    } else {
      setTimeout(() => {
        [].forEach.call(allTags, (tag) => {
          tag.classList.remove("is-active");
        });
        e.currentTarget.value = "";
        setNewTags("");
      }, 1000);
    }
  };
  return (
    <div className="post-tags">
      <h3>Tags (Required)</h3>
      <div className="post-tags-result">
        <div className="tags-selected">
          {currentTags &&
            currentTags.map((tag) => {
              return (
                <span
                  key={`tags-select-${
                    tag.value ? tag.value.replace(" ", "") : ""
                  }`}
                  className="tag"
                  onClick={(e) => {
                    removeTag(e);
                  }}
                  style={{
                    "--hue": `${
                      hexToHSL(tag.color) ? hexToHSL(tag.color).h : 0
                    }`,
                    "--sat": `${
                      hexToHSL(tag.color) ? hexToHSL(tag.color).s : 0
                    }`,
                    "--light": `${
                      hexToHSL(tag.color) ? hexToHSL(tag.color).l : 0
                    }`,
                  }}
                >
                  {tag.value}
                </span>
              );
            })}
        </div>
        <input
          className="tags-input"
          type={"text"}
          placeholder={"Graphic, UI/UX..."}
          onChange={(e) => {
            tagsSuggestion(e);
          }}
          onFocus={(e) => {
            e.currentTarget.classList.add("is-focus");
            showSuggestion(e, true);
          }}
          onBlur={(e) => {
            e.currentTarget.classList.remove("is-focus");
            showSuggestion(e, false);
          }}
        />
      </div>
      <div className="post-tags-suggestion">
        {tags &&
          tags.map((tag) => {
            if (
              currentTags.length &&
              currentTags.some((ele) => {
                if (ele.value === tag.value) {
                  return true;
                } else {
                  return false;
                }
              })
            ) {
              return <></>;
            } else {
              return (
                <span
                  key={`tag-suggess-${tag.value.replace(" ", "")}`}
                  data-color={tag.color}
                  className="tag"
                  onClick={(e) => {
                    addTag(e);
                  }}
                  style={{
                    "--hue": `${hexToHSL(tag.color).h}`,
                    "--sat": `${hexToHSL(tag.color).s}`,
                    "--light": `${hexToHSL(tag.color).l}`,
                  }}
                >
                  {tag.value}
                </span>
              );
            }
          })}
        <span
          className="tag is-new-tag"
          onClick={(e) => {
            addTag(e);
          }}
          style={{
            display: `${newTags ? "inline-block" : "none"}`,
            "--hue": `${hexToHSL(`#${randomColor}`).h}`,
            "--sat": `${hexToHSL(`#${randomColor}`).s}`,
            "--light": `${hexToHSL(`#${randomColor}`).l}`,
          }}
        >
          {newTags}
        </span>
      </div>
    </div>
  );
}

export default Tags;
