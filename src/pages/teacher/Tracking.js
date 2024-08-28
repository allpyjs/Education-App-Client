import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import ServerURL from "../../utils/ServerURL";
import { Link } from "react-router-dom";
import axios from "axios";

export const Tracking = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [students, setStudents] = useState([]);
  const [goals, setGoals] = useState([]);
  const [coins, setCoins] = useState(0);
  const getColor = () => {
    return "#F4B200";
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
      });
    axios.get(ServerURL.BASE_URL + "/goal/?user=" + user.id).then((res) => {
      setGoals(res.data);
    });
  }, []);
  /* eslint-enable */
  const pieData = students.map((student) => ({
    name: student.name,
    value: student.coin,
  }));
  const COLORS = ["#CCCC00", "#913A7E", "#CCCC00", "#F4B200"];
  const COLORS1 = ["#F4B200", "#913A7E", "#F4B200", "#003595"];
  const COLORS2 = ["#003595", "#913A7E", "#003595", "#F4B200"];
  return (
    <div className="container tracking">
      <div className="blue text">
        <div className="title">Tracking</div>
        <div className="text">
          <span>80%</span> of your students engaged their assignments this week.
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
            {students.map((student, index) => (
              <div className="row" key={index}>
                <div className="name">{student.name}</div>

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
          <div className="title">Monthly Data</div>
          <div className="graphs">
            <div className="lines">
              {students.map((student) => (
                <div
                  className="line"
                  style={{ color: getColor(student.earned) }}
                  key={student.id}
                >
                  <div
                    className="progress"
                    style={{
                      height:
                        coins !== 0 ? 100 * (student.coin / coins) + "%" : "",
                    }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="circles">
              <div className="circle">
                <PieChart width={200} height={200}>
                  <Pie data={pieData} dataKey="value" nameKey="name">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card more">
        <div className="title">School Year Data </div>
        <div className="graphs">
          <div className="lines">
            {students.map((student) => (
              <div
                className="line"
                style={{ color: getColor(student.earned) }}
                key={student.id}
              >
                <div
                  className="progress"
                  style={{
                    height:
                      coins !== 0 ? 100 * (student.coin / coins) + "%" : "",
                  }}
                ></div>
              </div>
            ))}
          </div>
          <div className="circles">
            <div className="circle">
              <PieChart width={200} height={200}>
                <Pie data={pieData} dataKey="value" nameKey="name">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS1[index]} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="circle">
              <PieChart width={200} height={200}>
                <Pie data={pieData} dataKey="value" nameKey="name">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS2[index]} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
