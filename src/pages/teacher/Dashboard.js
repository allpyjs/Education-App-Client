import React, { useEffect, useState } from "react";
import ServerURL from "../../utils/ServerURL";
import { Link } from "react-router-dom";
import axios from "axios";

export const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [students, setStudents] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [goals, setGoals] = useState([]);
  const [coins, setCoins] = useState(0);
  const getColor = (point) => {
    if (point === 3) {
      return "#F4B200";
    } else if (point < 3) {
      return "#913A7E";
    } else {
      return "#CCCC00";
    }
  };
  /* eslint-disable */
  useEffect(() => {
    axios
      .get(ServerURL.BASE_URL + "/student/?teacher=" + user.profile.id)
      .then((res) => {
        setStudents(res.data);
        let val = 0;
        res.data.map((item) => (val += item.coin));
        setCoins(val);
      })
      .catch(() => console.error("error"));
    axios
      .get(ServerURL.BASE_URL + "/reward/?school=" + user.profile.school)
      .then((res) => setRewards(res.data))
      .catch(() => console.error("error"));
    axios
      .get(ServerURL.BASE_URL + "/goal/?user=" + user.id)
      .then((res) => setGoals(res.data))
      .catch(() => console.error("error"));
  }, []);
  /* eslint-enable */
  return (
    <div className="container">
      <div className="blue text">
        <div className="title">
          Welcome back <span>{user.name}</span>
        </div>
        <div className="text medium">
          <span className="bold">80%</span> of your students engaged their
          assignments this week.
        </div>
      </div>
      <div className="category">
        <Link to="/students">
          <div className="card students">
            <div className="label">Students</div>
            <div className="number">{students.length}</div>
          </div>
        </Link>
        <Link to="/goals">
          <div className="card goals">
            <div className="label">Goals</div>
            <div className="number">{goals.length}</div>
          </div>
        </Link>
      </div>
      <div className="details">
        <div className="card">
          <div className="title">Student Engagement</div>
          <div className="content">
            <div className="row">
              <div className="label">Students</div>
              <div className="label">Coins Earned</div>
            </div>
            <div className="divider" />
            {students.map((student) => (
              <div className="row" key={student.id}>
                <Link to={"/student/" + student.id}>
                  <div className="name">{student.name}</div>
                </Link>

                <div
                  className="result"
                  style={{ color: getColor(student.coin) }}
                >
                  <div className="line">
                    <div
                      className="progress"
                      style={{
                        width: 100 * (student.coin / coins) + "%",
                      }}
                    />
                  </div>
                  <div className="text">
                    {student.coin} of {coins}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="title">Ready for redemption</div>
          {rewards.map((reward) => (
            <div className="row" key={reward.id}>
              <div className="detail">
                <div className="image">
                  <img src={ServerURL.BASE_URL + reward.image} alt="goal" />
                </div>
                <div className="name">{reward.title}</div>
              </div>
              <Link to={"/reward/" + reward.id}>
                <div className="btn">View</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="card more">
        <div className="title">More Content</div>
      </div>
    </div>
  );
};
