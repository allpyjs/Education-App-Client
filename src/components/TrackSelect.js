import React, { useRef, useState, useEffect } from "react";
import { ReactComponent as DownArrow } from "../assets/Icons/DownArrow.svg";

const GoalSelect = ({
  value = "",
  options = [],
  onChange,
  placeholder = "",
}) => {
  const ref = useRef();
  const [open, setOpen] = useState(false);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setOpen(false);
    }
  };
  /* eslint-disable */
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  /* eslint-enable */
  return (
    <div
      className={open ? "select open" : "select"}
      onClick={() => setOpen(!open)}
      ref={ref}
    >
      <div className="btn">
        <div className="detail">
          <div className="name">
            {!value
              ? placeholder
              : options.find((item) => item.id === value)?.name}
          </div>
        </div>
        <div className="icon">
          <DownArrow />
        </div>
      </div>

      <div className="options">
        <div className="details">
          <div className="detail" onClick={() => onChange(null)}>
            {placeholder}
          </div>
          {options.map((option, index) => (
            <div
              className="detail"
              onClick={() => onChange(option.id)}
              key={index}
            >
              <div className="name">{option.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalSelect;
