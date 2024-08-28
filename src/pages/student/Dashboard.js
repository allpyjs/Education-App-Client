import React, { useEffect, useState } from "react";
import ServerURL from "../../utils/ServerURL";
import axios from "axios";
import moment from "moment";
import Select from "../../components/Select";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [student, setStudent] = useState({});
  const [type, setType] = useState("Behavioral");
  const [goals, setGoals] = useState([]);
  const [length, setLength] = useState();
  const [complete, setComplete] = useState(0);

  const fetch = (data = []) => {
    setGoals(data?.filter((item) => item.type === type));
    setComplete(
      data?.filter((item) => item.type === type && item.status === "completed")
    );
  };
  /* eslint-disable */
  useEffect(() => {
    axios
      .get(ServerURL.BASE_URL + "/student/?id=" + user.profile.id)
      .then((res) => {
        setStudent(res.data);
        fetch(res.data.goals);
      });
    axios.get(ServerURL.BASE_URL + "/goals/").then((res) => {
      setLength(res.data.length);
    });
  }, []);

  useEffect(() => {
    fetch(student.goals);
  }, [type]);
  /* eslint-enable */
  return (
    <div className="container">
      <div className="blue text">
        <div className="title">
          Welcome back <span>{student.name}</span>
        </div>
        <div className="text medium">
          “Do what you can, with what you have, where you are.”{" "}
          <span className="bold">―Theodore Roosevelt.</span>
        </div>
      </div>
      <div className="category">
        <Link to="/goals">
          <div className="card goals">
            <div className="label">Goals</div>
            <div className="number">{student.goals?.length}</div>
          </div>
        </Link>

        <div className="card coins">
          <div className="label">Coins Earned</div>
          <div className="number">{student.coin}</div>
        </div>
      </div>
      <div className="details progress">
        <div className="card">
          <div className="title">My Engagement</div>
          <div className="small-text ">
            <div className="bold">Goals Met:</div>
            <div className="medium">
              {student.goals?.length} of {length}
            </div>
          </div>
          <div className="small-text">
            <div className="bold">Last login:</div>
            <div className="medium">
              {student.last_login &&
                moment(student.last_login).format("MMM. DD, YYYY hh:mm")}
            </div>
          </div>
          <div className="small-text">
            <div className="bold">Last Redemption:</div>
            <div className="medium">Jun. 02, 2022</div>
          </div>
        </div>

        <div className="card">
          <div className="progress">
            <div className="header">
              <div className="title">This Week's Progress</div>
              <Select
                value={type}
                options={["Behavioral", "Academic", "Parent"]}
                onChange={(val) => setType(val)}
              />
            </div>
            <div className="progress-line">
              <div className="line">
                <div
                  className={"progress " + type}
                  style={{
                    width:
                      goals?.length > 0
                        ? 100 * (complete?.length / goals?.length) + "%"
                        : 0,
                  }}
                />
              </div>
              <div className="text">
                {complete?.length} of {goals?.length}
              </div>
            </div>
          </div>
          <div className="divider" />
          <div className="rewards">
            <div className="header">
              <div className="title">Selected Rewards</div>
            </div>
            <div className="row">
              {student.rewards?.map((reward, index) => (
                <div className="reward" key={index}>
                  <div className="image">
                    <img src={ServerURL.BASE_URL + reward.image} alt="reward" />
                  </div>
                  <div className="mark">{reward.coin}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="card more">
        <div className="title">More Content</div>
      </div>
    </div>
  );
};
