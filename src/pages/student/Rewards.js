import React, { useEffect, useState } from "react";
import { ReactComponent as BiArrow } from "../../assets/Icons/Bi Arrow.svg";
import axios from "axios";
import ServerURL from "../../utils/ServerURL";

export const Rewards = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    axios
      .get(ServerURL.BASE_URL + "/reward/")
      .then((res) => setRewards(res.data));
  }, []);

  const select = (id) => {
    axios.post(ServerURL.BASE_URL + "/reward/?id=" + id, {
      student: user.profile.id,
    });
  };
  return (
    <div className="container rewards">
      <div className="header">
        <div className="title">Rewards</div>
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
          <div className="header">
            <div className="image">Image</div>
            <div className="name">Reward Name</div>
            <div className="coin">Coins Needed</div>
          </div>
          {rewards.map((reward, index) => (
            <div className="reward" key={index}>
              <div className="detail">
                <div className="image">
                  <img src={ServerURL.BASE_URL + reward.image} alt="reward" />
                </div>
                <div className="name">{reward.title}</div>
                <div className="coin">
                  <div className="circle">{reward.coin}</div>
                </div>
              </div>
              <div className="btn" onClick={() => select(reward.id)}>
                Select
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
