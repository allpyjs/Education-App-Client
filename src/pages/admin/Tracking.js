import React, { useEffect, useState } from "react";
import { ReactComponent as BiArrow } from "../../assets/Icons/Bi Arrow.svg";
import ServerURL from "../../utils/ServerURL";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";

export const Tracking = () => {
  const [tab, setTab] = useState("student");

  const [data, setData] = useState([]);

  /* eslint-disable */
  useEffect(() => {
    axios
      .get(`${ServerURL.BASE_URL}/${tab}/`)
      .then((res) => setData(res.data))
      .catch(() => console.error("error"));
  }, [tab]);
  /* eslint-enable */
  return (
    <div className="container">
      <div className="blue tracking">
        <div className="title">Tracking</div>
        <div className="text">
          <span>80%</span> of your students engaged their assignments this week.
        </div>
      </div>
      <div className="card students">
        <div className="tabs">
          <div
            className={tab === "student" ? "tab active" : "tab"}
            onClick={() => setTab("student")}
          >
            Students
          </div>
          <div
            className={tab === "school" ? "tab active" : "tab"}
            onClick={() => setTab("school")}
          >
            Schools
          </div>
          <div
            className={tab === "teacher" ? "tab active" : "tab"}
            onClick={() => setTab("teacher")}
          >
            Teachers
          </div>
          <div
            className={tab === "parent" ? "tab active" : "tab"}
            onClick={() => setTab("parent")}
          >
            Parents
          </div>
          <div
            className={tab === "reward" ? "tab active" : "tab"}
            onClick={() => setTab("reward")}
          >
            Rewards
          </div>
        </div>
        <div className="filter">
          <div className="search">
            <input type="text" placeholder="Search for a reward" />
            <div className="search-icon">
              <div className="icon" />
            </div>
          </div>
          <div className="btn">
            <div className="text">Filter</div>
            <div className="icon">
              <BiArrow />
            </div>
          </div>
        </div>
        <div className="row small">
          <div className="col">
            <div className="label">Names</div>
            {data.map((item, index) => (
              <div
                className={tab !== "school" ? "item names" : "item school"}
                key={index}
              >
                <div className="image">
                  <img src={ServerURL.BASE_URL + item?.image} alt="Logo" />
                </div>
                <div className="name">
                  {tab !== "reward" ? item?.name : item.title}
                </div>
              </div>
            ))}
          </div>
          {tab !== "reward" && tab !== "school" && (
            <div className="col">
              <div className="label">Schools</div>
              {data.map((item, index) => (
                <div className="item school" key={index}>
                  <div className="image">
                    <img
                      src={ServerURL.BASE_URL + item?.school?.image}
                      alt="School"
                    />
                  </div>
                  <div className="name">{item?.school?.name}</div>
                </div>
              ))}
            </div>
          )}
          {tab === "student" && (
            <div className="col count">
              <div className="label">Coins Earned</div>
              {data.map((item, index) => (
                <div className="item" key={index}>
                  {item.coin}
                </div>
              ))}
            </div>
          )}
          {tab === "school" && (
            <div className="col count">
              <div className="label">Teacher Count</div>
              {data.map((item, index) => (
                <div className="item" key={index}>
                  {item.teachers}
                </div>
              ))}
            </div>
          )}
          {(tab === "school" || tab === "teacher") && (
            <div className="col count">
              <div className="label">Student Count</div>
              {data.map((item, index) => (
                <div className="item" key={index}>
                  {item?.students}
                </div>
              ))}
            </div>
          )}
          {tab === "reward" && (
            <>
              <div className="col count">
                <div className="label">Coins Needed</div>
                {data.map((item, index) => (
                  <div className="item" key={index}>
                    {item.coin}
                  </div>
                ))}
              </div>
              <div className="col count">
                <div className="label">Used</div>
                {data.map((item, index) => (
                  <div className="item" key={index}>
                    {item.students}
                  </div>
                ))}
              </div>
            </>
          )}
          {tab !== "reward" && tab !== "school" && (
            <div className="col">
              <div className="label">Last Active</div>
              {data.map((item, index) => (
                <div className="item" key={index}>
                  {item.last_login &&
                    moment(item.last_login).format("MM/DD/YYYY")}
                </div>
              ))}
            </div>
          )}

          <div className="col action">
            <div className="label">Actions</div>
            {data.map((item, index) => (
              <div className="item" key={index}>
                <Link to={`/${tab}/${item.id}`}>
                  <div className="btn">View</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
