import React, { useState } from "react";
import { DayPicker } from "react-day-picker";

function CustomeDaypicker(props) {
  const [selected, setSelected] = useState(props.value ? new Date(props.value) : new Date());
  const handleCallBack = (e) => {
    let mm = 0;
    let dd = 0;
    let currentSelectDay = "";
    if (e) {
      mm = e.getMonth() + 1; // Months start at 0!
      dd = e.getDate();

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;
      currentSelectDay = dd + "/" + mm + "/" + e.getFullYear();
    } else {
      currentSelectDay = "Select a day";
    }
    setSelected(e);
    props.callback(currentSelectDay);
  };
  return (
    <DayPicker
      className="daypicker"
      mode="single"
      selected={selected}
      onSelect={(e) => {
        document.querySelector(".daypicker").classList.toggle("is-active");
        handleCallBack(e);
      }}
    />
  );
}

export default CustomeDaypicker;
