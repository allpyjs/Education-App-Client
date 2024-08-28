import React, { useState } from "react";
import { ReactComponent as Logo } from "../assets/Icons/Logo.svg";
import { ReactComponent as StudentIcon } from "../assets/Icons/Student.svg";
import { ReactComponent as GoalIcon } from "../assets/Icons/Goals.svg";
import { ReactComponent as MessageIcon } from "../assets/Icons/Messages.svg";
import { ReactComponent as RewardsIcon } from "../assets/Icons/Rewards.svg";
import { ReactComponent as TrackingIcon } from "../assets/Icons/Tracking.svg";
import { ReactComponent as BiArrow } from "../assets/Icons/Bi Arrow.svg";
import { ReactComponent as DownArrow } from "../assets/Icons/DownArrow.svg";
import { ReactComponent as BarsCode } from "../assets/Icons/bars-solid.svg";
import { ReactComponent as XIcon } from "../assets/Icons/X.svg";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ServerURL from "../utils/ServerURL";

import CookieUtil from "../utils/CookieUtil";
import Constants from "../utils/constants";

const Layout = ({ children, role, show, setShow }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);

  const logout = async () => {
    localStorage.clear();
    CookieUtil.deleteCookie(Constants.ACCESS_PROPERTY);
    CookieUtil.deleteCookie(Constants.REFRESH_PROPERTY);
    navigate("/login");
  };
  return (
    <>
      {location.pathname !== "/login" ? (
        <>
          <div className={open ? "navbar active" : "navbar"}>
            <div className="icon" onClick={() => setOpen(false)}>
              <XIcon />
            </div>
            <Link to="/">
              <div className="logo">
                <Logo />
              </div>
            </Link>

            {role === "teacher" && (
              <div className="navmenu">
                <Link
                  to="/"
                  className={location.pathname === "/" ? "active" : ""}
                >
                  <div className="text">Dashboard</div>
                </Link>
                <Link
                  to="/students"
                  className={
                    location.pathname.startsWith("/student") ? "active" : ""
                  }
                >
                  <StudentIcon />
                  <div className="text">Students</div>
                </Link>
                <Link
                  to={"/parents"}
                  className={
                    location.pathname.startsWith("/parent") ? "active" : ""
                  }
                >
                  <StudentIcon />
                  <div className="text">Parents</div>
                </Link>
                <Link
                  to="/goals"
                  className={
                    location.pathname.startsWith("/goal") ? "active" : ""
                  }
                >
                  <GoalIcon />
                  <div className="text">Goals</div>
                </Link>
                <Link
                  to="/messages"
                  className={
                    location.pathname.startsWith("/message") ? "active" : ""
                  }
                >
                  <MessageIcon />
                  <div className="text">Messages</div>
                </Link>
                <Link
                  to="/rewards"
                  className={
                    location.pathname.startsWith("/reward") ? "active" : ""
                  }
                >
                  <RewardsIcon />
                  <div className="text">Rewards</div>
                </Link>
                <Link
                  to="/tracking"
                  className={location.pathname === "/tracking" ? "active" : ""}
                >
                  <TrackingIcon />
                  <div className="text">Tracking</div>
                </Link>
              </div>
            )}
            {role === "parent" && (
              <div className="navmenu">
                <Link
                  to="/"
                  className={location.pathname === "/" ? "active" : ""}
                >
                  <div className="text">Dashboard</div>
                </Link>

                <Link
                  to="/goals"
                  className={
                    location.pathname.startsWith("/goal") ? "active" : ""
                  }
                >
                  <GoalIcon />
                  <div className="text">Goals</div>
                </Link>

                <Link
                  to="/tracking"
                  className={location.pathname === "/tracking" ? "active" : ""}
                >
                  <TrackingIcon />
                  <div className="text">Tracking</div>
                </Link>
                <Link
                  to="/students"
                  className={
                    location.pathname.startsWith("/student") ? "active" : ""
                  }
                >
                  <StudentIcon />
                  <div className="text">Students</div>
                </Link>
                <Link
                  to="/messages"
                  className={
                    location.pathname.startsWith("/message") ? "active" : ""
                  }
                >
                  <MessageIcon />
                  <div className="text">Messages</div>
                </Link>
              </div>
            )}
            {role === "student" && (
              <div className="navmenu">
                <Link
                  to="/"
                  className={location.pathname === "/" ? "active" : ""}
                >
                  <div className="text">Dashboard</div>
                </Link>
                <Link
                  to="/goals"
                  className={
                    location.pathname.startsWith("/goal") ? "active" : ""
                  }
                >
                  <GoalIcon />
                  <div className="text">Goals</div>
                </Link>
                <Link
                  to="/progress"
                  className={
                    location.pathname.startsWith("/progress") ? "active" : ""
                  }
                >
                  <TrackingIcon />
                  <div className="text">My Progress</div>
                </Link>
                <Link
                  to="/messages"
                  className={
                    location.pathname.startsWith("/message") ? "active" : ""
                  }
                >
                  <MessageIcon />
                  <div className="text">Messages</div>
                </Link>
                <Link
                  to="/rewards"
                  className={
                    location.pathname.startsWith("/reward") ? "active" : ""
                  }
                >
                  <RewardsIcon />
                  <div className="text">Rewards</div>
                </Link>
              </div>
            )}
            {role === "admin" && (
              <div className="navmenu">
                <Link
                  to="/"
                  className={location.pathname === "/" ? "active" : ""}
                >
                  <div className="text">Dashboard</div>
                </Link>
                <Link
                  to="/students"
                  className={
                    location.pathname.startsWith("/student") ? "active" : ""
                  }
                >
                  <StudentIcon />
                  <div className="text">Students</div>
                </Link>
                <Link
                  to="/parents"
                  className={
                    location.pathname.startsWith("/parent") ? "active" : ""
                  }
                >
                  <StudentIcon />
                  <div className="text">Parents</div>
                </Link>
                <Link
                  to="/teachers"
                  className={
                    location.pathname.startsWith("/teacher") ? "active" : ""
                  }
                >
                  <StudentIcon />
                  <div className="text">Teachers</div>
                </Link>
                <Link
                  to="/schools"
                  className={
                    location.pathname.startsWith("/school") ? "active" : ""
                  }
                >
                  <StudentIcon />
                  <div className="text">Schools</div>
                </Link>
                {/* <Link
                  to="/messages"
                  className={location.pathname === "/messages" ? "active" : ""}
                >
                  <MessageIcon />
                  <div className="text">Messages</div>
                </Link> */}
                <Link
                  to="/rewards"
                  className={
                    location.pathname.startsWith("/reward") ? "active" : ""
                  }
                >
                  <RewardsIcon />
                  <div className="text">Rewards</div>
                </Link>
                <Link
                  to="/tracking"
                  className={location.pathname === "/tracking" ? "active" : ""}
                >
                  <TrackingIcon />
                  <div className="text">Tracking</div>
                </Link>
              </div>
            )}
            {role === "school" && (
              <div className="navmenu">
                <div className="school-logo">
                  <div className="image">
                    <img
                      src={ServerURL.BASE_URL + user.image}
                      alt="SchoolLogo"
                    />
                  </div>
                  <div className="name">{user.name}</div>
                </div>
                <Link
                  to="/"
                  className={location.pathname === "/" ? "active" : ""}
                >
                  <div className="text">Dashboard</div>
                </Link>
                <Link
                  to="/students"
                  className={
                    location.pathname.startsWith("/student") ? "active" : ""
                  }
                >
                  <StudentIcon />
                  <div className="text">Students</div>
                </Link>
                <Link
                  to="/parents"
                  className={
                    location.pathname.startsWith("/parent") ? "active" : ""
                  }
                >
                  <StudentIcon />
                  <div className="text">Parents</div>
                </Link>
                <Link
                  to="/teachers"
                  className={
                    location.pathname.startsWith("/teacher") ? "active" : ""
                  }
                >
                  <StudentIcon />
                  <div className="text">Teachers</div>
                </Link>
                {/* <Link
                  to="/messages"
                  className={location.pathname === "/messages" ? "active" : ""}
                >
                  <MessageIcon />
                  <div className="text">Messages</div>
                </Link> */}
                <Link
                  to="/rewards"
                  className={
                    location.pathname.startsWith("/reward") ? "active" : ""
                  }
                >
                  <RewardsIcon />
                  <div className="text">Rewards</div>
                </Link>
                <Link
                  to="/tracking"
                  className={location.pathname === "/tracking" ? "active" : ""}
                >
                  <TrackingIcon />
                  <div className="text">Tracking</div>
                </Link>
              </div>
            )}
            <div className="logout" onClick={logout}>
              Sign Out
            </div>
          </div>
          <div className="main">
            <div className="top">
              <div className="topbar">
                <div className="search">
                  <div className="icon" onClick={() => setOpen(true)}>
                    <BarsCode />
                  </div>
                  <input
                    className="small-text"
                    type="text"
                    placeholder="Type a new message"
                  />
                  <div className="search-icon">
                    <div className="icon" />
                  </div>
                </div>
                <div className="circles">
                  <div className="circle first" />
                  <div className="circle second" />
                </div>
              </div>
              {location.pathname !== "/messages" &&
                role !== "admin" &&
                role !== "school" &&
                !show && (
                  <div className="messagebar" onClick={() => setShow(true)}>
                    <div className="text bold">Message</div>
                    <Link to="/messages">
                      <div className="btn">
                        <BiArrow />
                      </div>
                    </Link>
                  </div>
                )}
            </div>
            {children}
          </div>
          {location.pathname !== "/messages" &&
            role !== "admin" &&
            role !== "school" &&
            show && (
              <div className="message-sidebar">
                <div className="title" onClick={() => setShow(false)}>
                  Messages
                </div>

                <div className="chat-container">
                  <div className="users">
                    <div className="user-group">
                      <div className="user">
                        <div className="name small-text medium">Student</div>
                        <div className="icon">
                          <DownArrow />
                        </div>
                      </div>
                      <div className="user">
                        <div className="name small-text medium">
                          Johannes Bro
                        </div>
                        <div className="icon">
                          <DownArrow />
                        </div>
                      </div>
                    </div>
                    <Link to="/messages">
                      <div className="btn">
                        <BiArrow />
                      </div>
                    </Link>
                  </div>
                  <div className="messages"></div>
                  <div className="chat">
                    <input type="text" placeholder="Type a new message" />
                    <div className="btn">
                      <div className="icon message" />
                    </div>
                  </div>
                </div>
              </div>
            )}
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default Layout;
