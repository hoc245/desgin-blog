import React, { useEffect, useState } from "react";

function Tags(props) {
  const [tags, setTags] = useState();
  useEffect(() => {
    if (props.tags) {
      setTags([Object.keys(props.tags)[0].replace("-", "/")]);
    }
  }, [props.tags]);
  const addTag = (e) => {
    const value = e.currentTarget.innerHTML;
    const input = document.querySelector(".tags-input");
    const mArray = tags && tags.length > 0 ? tags.slice() : [];
    const allTags = document.querySelectorAll(".post-tags-suggestion .tag");
    if (mArray === [] || mArray === null || mArray.indexOf(value) === -1) {
      mArray.push(value);
      setTags(mArray);
      input.value = "";
      [].forEach.call(allTags, (tag) => {
        tag.classList.remove("is-active");
      });
    }
  };
  const removeTag = (e) => {
    const mArray = tags.slice();
    const value = e.currentTarget.innerHTML;
    mArray.splice(mArray.indexOf(value), 1);
    setTags(mArray);
  };
  const tagsSuggestion = (e) => {
    const value = e.currentTarget.value;
    const tags = document.querySelectorAll(".post-tags-suggestion .tag");
    if (value) {
      [].forEach.call(tags, (tag) => {
        if (tag.innerHTML.toLowerCase().includes(value)) {
          tag.classList.add("is-active");
        } else {
          tag.classList.remove("is-active");
        }
      });
    } else {
      [].forEach.call(tags, (tag) => {
        tag.classList.remove("is-active");
      });
    }
  };
  return (
    <div className="post-tags">
      <h3>Tags (Required)</h3>
      <div className="post-tags-result">
        <div className="tags-selected">
          {tags &&
            tags.map((tag) => {
              return (
                <span
                  key={`post-tags-${tag}`}
                  className="tag is-selected"
                  onClick={(e) => {
                    removeTag(e);
                  }}
                >
                  {tag}
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
          }}
          onBlur={(e) => {
            e.currentTarget.classList.remove("is-focus");
          }}
        />
      </div>
      <div className="post-tags-suggestion">
        <span
          className="tag"
          onClick={(e) => {
            addTag(e);
          }}
        >
          Graphic
        </span>
        <span
          className="tag"
          onClick={(e) => {
            addTag(e);
          }}
        >
          UI/UX
        </span>
        <span
          className="tag"
          onClick={(e) => {
            addTag(e);
          }}
        >
          Trends
        </span>
      </div>
    </div>
  );
}

export default Tags;
