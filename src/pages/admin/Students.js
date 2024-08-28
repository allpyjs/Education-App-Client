import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ServerURL from "../../utils/ServerURL";
import axios from "axios";

export const Students = () => {
  const [students, setStudents] = useState([]);
  /* eslint-disable */
  useEffect(() => {
    axios
      .get(ServerURL.BASE_URL + "/student/")
      .then((res) => setStudents(res.data))
      .catch(() => console.error("error"));
  }, []);
  /* eslint-enable */
  return (
    <div className="container">
      <div className="header">
        <div className="title">Students</div>
        {/* <Link to="/student">
          <div className="btn">
            <div className="text">New Student</div>
            <div className="plus">+</div>
          </div>
        </Link> */}
      </div>
      <div className="card students">
        <div className="row">
          <div className="col">
            <div className="label">Names</div>
            {students.map((student, index) => (
              <div className="item names" key={index}>
                <div className="image">
                  <img src={ServerURL.BASE_URL + student.image} alt="avatar" />
                </div>
                <div className="name">{student.name}</div>
              </div>
            ))}
          </div>
          <div className="col">
            <div className="label">School</div>
            {students.map((student, index) => (
              <div className="item school" key={index}>
                <div className="image">
                  <img
                    src={ServerURL.BASE_URL + student.school.image}
                    alt="School"
                  />
                </div>
                <div className="name">{student.school.name}</div>
              </div>
            ))}
          </div>
          <div className="col action">
            <div className="label">Action</div>
            {students.map((student, index) => (
              <div className="item" key={index}>
                <Link to={"/student/" + student.id}>
                  <div className="btn">Edit</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
