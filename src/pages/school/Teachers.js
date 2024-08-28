import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ServerURL from "../../utils/ServerURL";
import axios from "axios";

export const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios
      .get(ServerURL.BASE_URL + "/teacher/?school=" + user.profile.id)
      .then((res) => setTeachers(res.data))
      .catch(() => {
        console.error("error");
      });
  }, []);
  return (
    <div className="container">
      <div className="header">
        <div className="title">Teacher</div>
        <Link to="/teacher" className="btn">
          <div className="text">New Teacher</div>
          <div className="plus">+</div>
        </Link>
      </div>
      <div className="card students">
        <div className="row">
          <div className="col">
            <div className="label">Names</div>
            {teachers.map((teacher, index) => (
              <div className="item names" key={index}>
                <div className="image">
                  <img src={ServerURL.BASE_URL + teacher.image} alt="Teacher" />
                </div>
                <div className="name">{teacher.name}</div>
              </div>
            ))}
          </div>
          <div className="col count">
            <div className="label">Student Count</div>
            {teachers.map((teacher, index) => (
              <div className="item" key={index}>
                {teacher.students}
              </div>
            ))}
          </div>
          <div className="col action">
            <div className="label">Actions</div>
            {teachers.map((teacher, index) => (
              <div className="item" key={index}>
                <Link to={`/teacher/${teacher.id}`} className="btn">
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
