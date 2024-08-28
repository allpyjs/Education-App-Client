import React, { useState } from "react";
import { ReactComponent as EyeIcon } from "../assets/Icons/Tracking.svg";
import { ReactComponent as EyeSlashIcon } from "../assets/Icons/eye-slash-icon.svg";
const Password = ({ value, placeholder, onChange }) => {
  const [type, setType] = useState("password");
  const onChangeType = () => {
    if (type === "text") {
      setType("password");
    } else {
      setType("text");
    }
  };
  return (
    <div className="password">
      <input
        type={type}
        className="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <div className="icon" onClick={onChangeType}>
        {type === "password" ? <EyeIcon /> : <EyeSlashIcon />}
      </div>
    </div>
  );
};

export default Password;
