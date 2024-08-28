import React, { useRef, useState, useEffect } from "react";
import { ReactComponent as DownArrow } from "../assets/Icons/DownArrow.svg";

const CountrySelect = ({
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
  const label = options?.find((item) => item.value === value)?.label;
  return (
    <div
      className={open ? "select open" : "select"}
      onClick={() => setOpen(!open)}
      ref={ref}
    >
      <input
        type="text"
        className="text"
        value={label}
        disabled
        placeholder={placeholder}
      />
      <div className="icon">
        <DownArrow />
      </div>

      <div className="options">
        <div className="details">
          {options.map((option, index) => (
            <div
              className="text"
              onClick={() => onChange(option.value)}
              key={index}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountrySelect;
