import React, { useState, useEffect } from "react";
import { ReactComponent as DownArrow } from "../../assets/Icons/DownArrow.svg";
import moment from "moment";
import ServerURL from "../../utils/ServerURL";
import axios from "axios";
import { useParams } from "react-router-dom";
import Select from "../../components/Select";

export const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [type, setType] = useState("Behavioral");
  const params = useParams();
  const [student, setStudent] = useState({});
  const [rewards, setRewards] = useState([]);
  const [modal, setModal] = useState(false);
  const [select, setSelect] = useState();
  const [goals, setGoals] = useState([]);
  const [complete, setComplete] = useState([]);
  const confirm = async () => {
    setModal(false);
  };
  /* eslint-disable */
  useEffect(() => {
    axios.get(ServerURL.BASE_URL + "/student/?id=" + params.id).then((res) => {
      setStudent(res.data);
      setSelect(res.data.rewards.map((item) => item.id));
      setGoals(res.data.goals?.filter((item) => item.type === type));
      setComplete(
        res.data.goals?.filter(
          (item) => item.type === type && item.status === "completed"
        )
      );
    });
    axios
      .get(ServerURL.BASE_URL + "/reward/?school=" + user.profile.school)
      .then((res) => setRewards(res.data));
  }, []);

  useEffect(() => {
    const goal = student.goals?.filter((item) => item.type === type);
    setGoals(goal);
    const complete = goal?.filter((item) => item.status === "completed");
    setComplete(complete);
  }, [type]);
  /* eslint-enable */

  return (
    <>
      <div className="container profile">
        <div className="card profile">
          <div className="header">
            <div className="title">Student Profile</div>
            <div className="info">
              <div className="image">
                <img src={ServerURL.BASE_URL + student.image} alt="avatar" />
              </div>
              <div className="status">
                <div className="status-info">
                  <div className="label">Status</div>
                  <div className="status">
                    <div className="circle green" />
                    <div className="text">Active</div>
                  </div>
                </div>
                <div className="login-info">
                  Last login:{" "}
                  {moment(student.last).format("MMM. DD, YYYY hh:mm")}
                </div>
              </div>
            </div>
            <div className="user-info">
              <div className="name">{student.name}</div>
              <div className="email">{student.email}</div>
            </div>
          </div>

          <div className="coins">
            <div className="text">My Coins</div>
            <div className={modal ? "circle active" : "circle"}>
              {student.coin}
            </div>
            <div className="redeem" onClick={() => setModal(true)}>
              Redeem
            </div>
          </div>
          <div className="details">
            <div className="change">Change</div>
            <div className="row">
              <div className="text">Grade</div>
              <div className="value">{student.grade}</div>
            </div>
            <div className="row">
              <div className="text">Gender</div>
              <div className="value">{student.gender}</div>
            </div>
            <div className="row">
              <div className="text">Athlete</div>
              <div className="value">{student.athlete ? "Yes" : "No"}</div>
            </div>
            <div className="row">
              <div className="text">College Bound</div>
              <div className="value">
                {student.college_bound ? "Yes" : "No"}
              </div>
            </div>
            <div className="row">
              <div className="text">Workforce Bound</div>
              <div className="value">
                {student.workforce_bound ? "Yes" : "No"}
              </div>
            </div>
            <div className="row interests">
              <div className="text">Interests</div>
              <div className="interests">
                {student.interests?.map((item, index) => (
                  <div className="interest" key={index}>
                    {item}
                  </div>
                ))}
                <div className="plus">+</div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-group">
          <div className="card">
            <div className="progress">
              <div className="header">
                <div className="title">This Week's Progress</div>
                <Select
                  value={type}
                  options={["Behavioral", "Academic"]}
                  onChange={(val) => setType(val)}
                />
              </div>
              <div className="progress-line">
                <div className="line">
                  <div
                    className="progress"
                    style={{
                      width: 100 * (complete?.length / goals?.length) + "%",
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
                      <img
                        src={ServerURL.BASE_URL + reward.image}
                        alt="reward"
                      />
                    </div>
                    <div className="mark">{reward.coin}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card progress">
            <div className="header">
              <div className="title">
                <div className="text">{type}</div>
                <div className="icon">
                  <DownArrow />
                </div>
              </div>
            </div>
            <div className="goals">
              {goals?.map((goal, index) => (
                <div className="goal-content" key={index}>
                  <div className="goal">
                    <div className="detail">
                      <div className="step">Goal {index + 1}</div>
                      <div className="name">{goal.name}</div>
                    </div>

                    <div className="action">
                      <div className="btn">View</div>
                    </div>
                  </div>
                  <div className={"status " + goal.status}>{goal.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {modal && (
        <div className="modal">
          <div className="card modal-main">
            <div className="header">
              <div className="title">Redeeming Coins</div>
              <div className="btn" onClick={() => setModal(false)}>
                Close
              </div>
            </div>
            <div className="coins">
              <div className="text">Current Coin Count</div>
              <div className="circle">{student.coin}</div>
            </div>
            <div className="rewards">
              <div className="text">Select Reward</div>
              <div className="row">
                {rewards.map((reward) => (
                  <div className="reward" onClick={() => setSelect(reward)}>
                    <div className="image">
                      <img
                        src={ServerURL.BASE_URL + reward.image}
                        alt="reward"
                      />
                    </div>
                    {select === reward && (
                      <div className="selected">Selected</div>
                    )}
                    <div className="mark">{reward.coin}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="btn-group">
              <div className="btn deny" onClick={() => setModal(false)}>
                Deny
              </div>
              <div className="btn confirm" onClick={() => confirm()}>
                Confirm
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
