import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ServerURL from "../../utils/ServerURL";
import axios from "axios";

export const Parents = () => {
  const [parents, setParents] = useState([]);

  useEffect(() => {
    axios
      .get(ServerURL.BASE_URL + "/parent/")
      .then((res) => setParents(res.data))
      .catch(() => console.error("error"));
  }, []);
  return (
    <div className="container">
      <div className="header">
        <div className="title">Parents</div>
        {/* <Link to="/parent">
          <div className="btn">
            <div className="text">New Parent</div>
            <div className="plus">+</div>
          </div>
        </Link> */}
      </div>
      <div className="card students">
        <div className="row">
          <div className="col">
            <div className="label">Names</div>
            {parents.map((parent, index) => (
              <div className="item names" key={index}>
                <div className="image">
                  <img src={ServerURL.BASE_URL + parent.image} alt="avatar" />
                </div>
                <div className="name">{parent.name}</div>
              </div>
            ))}
          </div>
          <div className="col">
            <div className="label">School</div>
            {parents.map((parent, index) => (
              <div className="item school" key={index}>
                <div className="image">
                  <img
                    src={ServerURL.BASE_URL + parent.school.image}
                    alt="School"
                  />
                </div>
                <div className="name">{parent.school.name}</div>
              </div>
            ))}
          </div>
          <div className="col action">
            <div className="label">Action</div>
            {parents.map((parent, index) => (
              <Link to={"/parent/" + parent.id} className="item" key={index}>
                <div className="btn">Edit</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
