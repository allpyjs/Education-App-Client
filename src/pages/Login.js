import React, { useEffect, useState } from "react";
import { ReactComponent as Logo } from "../assets/Icons/Logo.svg";
import axios from "axios";
import ServerURL from "../utils/ServerURL";
import { useNavigate } from "react-router-dom";
import CookieUtil from "../utils/CookieUtil";
import Constants from "../utils/constants";
import ApiConnector from "../utils/ApiConnector";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const Submit = async () => {
    try {
      const data = await ApiConnector.sendPostRequest(
        "/token/",
        JSON.stringify(user),
        false,
        false
      );
      if (data) {
        Object.keys(data).forEach((key) => {
          CookieUtil.setCookie(key, data[key]);
        });
        const token = data.access;
        axios
          .get(ServerURL.BASE_URL + "/profile/", {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((res) => {
            localStorage.setItem("user", JSON.stringify(res.data));
          })
          .then(() => {
            navigate("/");
          });
      }
    } catch {
      console.error("error");
    }
  };

  useEffect(() => {
    localStorage.clear();
    CookieUtil.deleteCookie(Constants.ACCESS_PROPERTY);
    CookieUtil.deleteCookie(Constants.REFRESH_PROPERTY);
  }, []);

  return (
    <div className="auth">
      <div className="topbar">
        <div className="logo">
          <Logo />
        </div>
      </div>
      <div className="container">
        <div className="card">
          <div className="title">Sign In</div>
          <div className="form-group">
            <div className="form-control">
              <div className="label">Username</div>
              <input
                type="text"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Username"
              />
            </div>
            <div className="form-control">
              <div className="label">Password</div>
              <input
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="Password"
              />
            </div>
          </div>
          <div className="btn" onClick={Submit}>
            Go
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
