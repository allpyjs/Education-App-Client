import React, { useEffect, useState } from "react";
import { ReactComponent as BiArrow } from "../../assets/Icons/Bi Arrow.svg";
import { Link } from "react-router-dom";
import ServerURL from "../../utils/ServerURL";
import axios from "axios";

export const Rewards = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [rewards, setRewards] = useState([]);

  /* eslint-disable */
  useEffect(() => {
    axios
      .get(ServerURL.BASE_URL + "/reward/?school=" + user.profile.school)
      .then((res) => setRewards(res.data));
  }, []);
  /* eslint-enable */
  return (
    <div className="container rewards">
      <div className="header">
        <div className="title">Rewards</div>
        <Link to="/reward">
          <div className="btn">
            <div className="text">New Rewards</div>
            <div className="plus">+</div>
          </div>
        </Link>
      </div>
      <div className="card rewards">
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
        <div className="rewards">
          {rewards.map((reward) => (
            <div className="reward">
              <div className="detail">
                <div className="image">
                  <img src={ServerURL.BASE_URL + reward.image} alt="reward" />
                </div>
                <div className="name">{reward.title}</div>
              </div>
              <Link to={"/reward/" + reward.id}>
                <div className="btn">Edit</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
