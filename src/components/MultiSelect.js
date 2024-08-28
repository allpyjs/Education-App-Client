import React, { useRef, useState, useEffect } from "react";
import { ReactComponent as DownArrow } from "../assets/Icons/DownArrow.svg";
import { ReactComponent as XIcon } from "../assets/Icons/X.svg";

const MultiSelect = ({
  value = [],
  options = [],
  add,
  remove,
  removeAll,
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
        {value.map((item, index) => (
          <div className="item" onClick={() => remove(item)} key={index}>
            <div className="text">{item}</div>
            <XIcon />
          </div>
        ))}
        <div className="icon">
          {value.length > 0 && (
            <div className="remove" onClick={removeAll}>
              <XIcon />
            </div>
          )}
          <DownArrow />
        </div>
      </div>

      <div className="options">
        <div className="details">
          {options.map((option, index) => (
            <div className="text" onClick={() => add(option)} key={index}>
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
