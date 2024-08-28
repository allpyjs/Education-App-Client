import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ServerURL from "../../utils/ServerURL";

export const Schools = () => {
  const [schools, setSchools] = useState([]);

  const fetchData = async () => {
    axios
      .get(ServerURL.BASE_URL + "/school/")
      .then((res) => {
        setSchools(res.data);
      })
      .catch(() => console.error("error"));
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="container">
      <div className="header">
        <div className="title">Schools</div>
        <Link to="/school" className="btn">
          <div className="text">New School</div>
          <div className="plus">+</div>
        </Link>
      </div>
      <div className="card students">
        <div className="row">
          <div className="col">
            <div className="label">School Name</div>
            {schools.map((school, index) => (
              <div className="item names" key={index}>
                <div className="image">
                  <img src={ServerURL.BASE_URL + school.image} alt="School" />
                </div>
                <div className="name">{school.name}</div>
              </div>
            ))}
          </div>
          <div className="col">
            <div className="label">School Level</div>
            {schools.map((school, index) => (
              <div className="item" key={index}>
                {school.level}
              </div>
            ))}
          </div>
          <div className="col count">
            <div className="label">Student Count</div>
            {schools.map((school, index) => (
              <div className="item" key={index}>
                {school.students}
              </div>
            ))}
          </div>
          <div className="col action">
            <div className="label">Actions</div>
            {schools.map((school, index) => (
              <div className="item" key={index}>
                <Link className="btn" to={"/school/" + school.id}>
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
