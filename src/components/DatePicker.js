import React, { useRef } from "react";
import { ReactComponent as XIcon } from "../assets/Icons/X.svg";

const DatePicker = ({ min = "", max = "", value = "", onChange }) => {
  const ref = useRef();
  const ref2 = useRef();
  return (
    <div
      className="date"
      onClick={(e) =>
        !ref2.current.contains(e.target)
          ? ref.current.showPicker()
          : (ref.current.value = null)
      }
    >
      <input
        type="date"
        value={value}
        ref={ref}
        min={min}
        max={max}
        onChange={onChange}
      />
      <div className="icon" ref={ref2}>
        <XIcon />
      </div>
    </div>
  );
};

export default DatePicker;
