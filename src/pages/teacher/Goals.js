import React, { useEffect, useState } from "react";
import { ReactComponent as Search } from "../../assets/Icons/Search - New Gray.svg";
import ServerURL from "../../utils/ServerURL";
import { Link } from "react-router-dom";
import axios from "axios";

export const Goals = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [type, setType] = useState("Behavioral");
  const [goals, setGoals] = useState([]);
  const [filterGoals, setFilterGoals] = useState([]);
  /* eslint-disable */
  useEffect(() => {
    axios
      .get(ServerURL.BASE_URL + "/goal/?user=" + user.id)
      .then((res) => {
        setGoals(res.data);
        setFilterGoals(res.data.filter((item) => item.type === type));
      })
      .catch(() => console.error("error"));
  }, []);

  useEffect(() => {
    setFilterGoals(goals.filter((item) => item.type === type));
  }, [type]);
  /* eslint-enable */

  const search = (e) => {
    const term = e.target.value;
    setFilterGoals(
      goals.filter((item) => item.type === type && item.name.startsWith(term))
    );
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">Goals</div>
        <Link to="/goal">
          <div className="btn">
            <div className="text">New Goal</div>
            <div className="plus">+</div>
          </div>
        </Link>
      </div>
      <div className="card goals">
        <div className="filter">
          <div className="type">
            <div
              className={
                type === "Behavioral" ? "Behavioral bold" : "Behavioral"
              }
              onClick={() => setType("Behavioral")}
            >
              Behavioral
            </div>
            <div
              className={type === "Academic" ? "Academic bold" : "Academic"}
              onClick={() => setType("Academic")}
            >
              Academic
            </div>
          </div>
        </div>
        <div className="search">
          <input
            type="search"
            placeholder="Search for a goal"
            onChange={search}
          />
          <div className="btn">
            <Search />
          </div>
        </div>
        {filterGoals.map((goal, index) => (
          <div className="goal" key={index}>
            <div className="detail">
              <div className="step">Goal {index + 1}</div>
              <div className="name">{goal.name}</div>
            </div>
            <div className="action">
              <Link to={"/goal/" + goal.id}>
                <div className="btn">Edit</div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
