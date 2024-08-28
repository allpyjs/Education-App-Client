import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ReactComponent as BiArrow } from "../../assets/Icons/Bi Arrow.svg";
import ServerURL from "../../utils/ServerURL";
import axios from "axios";

export const Reward = () => {
  const navigate = useNavigate();
  const [reward, setReward] = useState({
    title: "",
    url: "",
    coin: "",
    image: "",
    schools: [],
  });
  const [schools, setSchools] = useState([]);
  const [filterSchools, setFilterSchools] = useState([]);

  const Upload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      setReward({
        ...reward,
        image: img,
      });
    }
  };

  const Search = (e) => {
    const term = e.target.value;
    const filter = schools.filter((item) => item.name.includes(term));
    setFilterSchools(filter);
  };

  /* eslint-enable */
  const params = useParams();
  useEffect(() => {
    axios
      .get(ServerURL.BASE_URL + "/school/")
      .then((res) => {
        setSchools(res.data);
        setFilterSchools(res.data);
      })
      .catch(() => console.error("error"));

    if (params.id) {
      axios
        .get(ServerURL.BASE_URL + "/reward/?id=" + params.id)
        .then((res) => {
          let school_list = [];
          res.data.schools.forEach((item) => school_list.push(item.id));
          setReward({ ...res.data, schools: school_list });
        })
        .catch(() => console.error("error"));
    }
  }, [params.id]);
  /* eslint-disable */

  const Submit = async () => {
    console.log("reward", reward);
    try {
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
    } catch {
      console.error("error");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">{params.id ? "Edit" : "New"} Reward</div>
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

        <div className="form-control">
          <div className="header">
            <div className="label">Assign To Schools</div>
            <div className="filter">
              <div className="search">
                <input
                  type="text"
                  placeholder="Search for school"
                  onChange={Search}
                />
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
          </div>
          <div className="table">
            <div className="row header">
              <div className="select">Select</div>
              <div className="name">Customer Name</div>
            </div>
            {filterSchools.map((item, index) => (
              <div className="row" key={index}>
                <div className="select">
                  {!reward.schools.includes(item.id) ? (
                    <input
                      type="checkbox"
                      name="schools"
                      onChange={() =>
                        setReward({
                          ...reward,
                          schools: [...reward.schools, item.id],
                        })
                      }
                    />
                  ) : (
                    <input
                      type="checkbox"
                      name="schools"
                      onChange={() =>
                        setReward({
                          ...reward,
                          schools: reward.schools.filter(
                            (school) => school !== item.id
                          ),
                        })
                      }
                      checked
                    />
                  )}
                </div>
                <div className="col names">
                  <div className="image">
                    <img src={ServerURL.BASE_URL + item.image} alt="avatar" />
                  </div>
                  <div className="name">{item.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="submit" onClick={Submit}>
          Submit
        </div>
      </div>
    </div>
  );
};
