import React from "react";

export default function Button({
  iconLeft = "",
  iconRight = "",
  value,
  isSmall = false,
  state = "is-filled",
  ...rootDOMAttributes
}) {
  return (
    <button
      className={"button " + `${isSmall ? "is-small " : ""}` + `${state}`}
      {...rootDOMAttributes}
    >
      <span
        className={`${
          iconLeft === ""
            ? "is-hidden material-symbols-outlined"
            : "material-symbols-outlined"
        }`}
      >
        {iconLeft}
      </span>
      {value}
      <span
        className={`${
          iconRight === ""
            ? "is-hidden material-symbols-outlined"
            : "material-symbols-outlined"
        }`}
      >
        {iconRight}
      </span>
    </button>
  );
}
