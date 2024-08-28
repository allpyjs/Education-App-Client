import React, { useEffect, useState } from "react";
import { ReactComponent as BiArrow } from "../../assets/Icons/Bi Arrow.svg";
import { Link } from "react-router-dom";
import ServerURL from "../../utils/ServerURL";
import axios from "axios";

export const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  /* eslint-enable */
  useEffect(() => {
    axios
      .get(ServerURL.BASE_URL + "/reward/")
      .then((res) => setRewards(res.data))
      .catch(() => console.error("error"));
  }, []);
  /* eslint-disable */

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
      <div className="card students">
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
        <div className="row">
          <div className="col">
            <div className="label">Reward Names</div>
            {rewards.map((reward, index) => (
              <div className="item names" key={index}>
                <div className="image reward">
                  <img src={ServerURL.BASE_URL + reward.image} alt="reward" />
                </div>
                <div className="name">{reward.title}</div>
              </div>
            ))}
          </div>
          <div className="col count">
            <div className="label">Coins Needed</div>
            {rewards.map((reward, index) => (
              <div className="item" key={index}>
                {reward.coin}
              </div>
            ))}
          </div>
          <div className="col count">
            <div className="label">Used</div>
            {rewards.map((reward, index) => (
              <div className="item" key={index}>
                {reward.students}
              </div>
            ))}
          </div>
          <div className="col action">
            <div className="label">Actions</div>
            {rewards.map((reward, index) => (
              <div className="item" key={index}>
                <Link to={"/reward/" + reward.id}>
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
