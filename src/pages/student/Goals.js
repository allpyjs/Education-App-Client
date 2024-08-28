import React, { useEffect, useState } from "react";
import { ReactComponent as Search } from "../../assets/Icons/Search - New Gray.svg";
import ServerURL from "../../utils/ServerURL";
import axios from "axios";
import { Link } from "react-router-dom";

export const Goals = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [goals, setGoals] = useState([]);
  const [filterGoals, setFilterGoals] = useState([]);
  const [type, setType] = useState("Behavioral");
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState();

  const fetchData = async () => {
    const res1 = await axios.get(
      ServerURL.BASE_URL + "/goal/?student=" + user.profile.id
    );
    setGoals(res1.data);
    const res2 = await axios.get(
      ServerURL.BASE_URL + "/teacher/?student=" + user.profile.id
    );
    setTeachers(res2.data);
    if (res2.data && res2.data.length > 0) {
      setTeacher(res2.data[0].user);
      if (res1.data && res1.data.length > 0)
        setFilterGoals(
          res1.data.filter(
            (item) => item.reporter === res2.data[0].user && item.type === type
          )
        );
    }
  };

  /* eslint-disable */
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (type === "Parent") {
      setFilterGoals(goals?.filter((item) => item.type === type));
    } else {
      setFilterGoals(
        goals?.filter((item) => item.type === type && item.reporter === teacher)
      );
    }
  }, [type, teacher]);
  /* eslint-enable */
  return (
    <div className="container">
      <div className="header">
        <div className="title">Goals</div>
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
            <div
              className={type === "Parent" ? "Parent bold" : "Parent"}
              onClick={() => setType("Parent")}
            >
              Parent
            </div>
          </div>
        </div>
        {type !== "parent" && (
          <div className="teachers">
            <div className="label">Teacher</div>
            <div className="divider" />
            {teachers?.map((item, index) => (
              <div
                className={
                  teacher === item.user ? "teacher underline" : "teacher"
                }
                key={index}
                onClick={() => setTeacher(item.user)}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
        <div className="search">
          <input type="search" placeholder="Search for a goal" />
          <div className="btn">
            <Search />
          </div>
        </div>
        {filterGoals?.map((goal, index) => (
          <div className="goal" key={index}>
            <div className="detail">
              <div className="step">Goal {index + 1}</div>
              <div className="name">{goal.name}</div>
            </div>
            <div className="action">
              <Link className="btn" to={"/progress/" + goal.id}>
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
