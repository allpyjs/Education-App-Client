import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ServerURL from "../../utils/ServerURL";
import axios from "axios";

export const Reward = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [reward, setReward] = useState({
    title: "",
    url: "",
    coin: "",
    image: "",
    schools: [user.profile.id],
  });

  const Upload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      setReward({
        ...reward,
        image: img,
      });
    }
  };

  /* eslint-disable */
  const params = useParams();
  useEffect(() => {
    if (params.id) {
      axios
        .get(ServerURL.BASE_URL + "/reward/?id=" + params.id)
        .then((res) => {
          setReward({
            ...res.data,
            schools: res.data.schools.map((item) => item.id),
          });
        })
        .catch(() => console.error("error"));
    }
  }, []);
  /* eslint-enable */

  const Submit = async () => {
    if (params.id) {
      await axios
        .post(ServerURL.BASE_URL + "/reward/?id=" + params.id, reward, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch(() => console.error("error"));
    } else {
      await axios
        .post(ServerURL.BASE_URL + "/reward/", reward, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch(() => console.error("error"));
    }

    navigate("/rewards");
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">New Reward</div>
        <Link to="/reward">
          <div className="btn">
            <div className="text">New Rewards</div>
            <div className="plus">+</div>
          </div>
        </Link>
      </div>
      <div className="card new">
        <div className="form-control">
          <div className="label">Reward Title</div>
          <input
            type="text"
            className="text"
            placeholder="Reward Title"
            value={reward.title}
            onChange={(e) => setReward({ ...reward, title: e.target.value })}
          />
        </div>
        <div className="form-control">
          <div className="label">Reward URL</div>
          <input
            type="text"
            className="text"
            placeholder="Type URL"
            value={reward.url}
            onChange={(e) => setReward({ ...reward, url: e.target.value })}
          />
        </div>
        <div className="form-control">
          <div className="label">Reward Coin Value</div>
          <input
            type="number"
            min={0}
            value={reward.coin}
            className="text grade"
            onChange={(e) => setReward({ ...reward, coin: e.target.value })}
          />
        </div>
        <div className="form-control">
          <div className="label">Reward Picture</div>
          <input className="file" id="file" type="file" onChange={Upload} />
          {reward.image && (
            <img
              src={
                typeof reward.image === "string"
                  ? ServerURL.BASE_URL + reward.image
                  : URL.createObjectURL(reward.image)
              }
              alt="Reward"
            />
          )}
        </div>
        <div className="submit" onClick={Submit}>
          Submit
        </div>
      </div>
    </div>
  );
};
