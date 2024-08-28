import React, { useEffect, useState } from "react";
import { ReactComponent as DownArrow } from "../../assets/Icons/DownArrow.svg";
import moment from "moment";
import ServerURL from "../../utils/ServerURL";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export const Profile = () => {
  const params = useParams();
  const [goals, setGoals] = useState([]);
  const [complete, setComplete] = useState();
  const [student, setStudent] = useState({});

  /* eslint-disable */
  useEffect(() => {
    axios.get(ServerURL.BASE_URL + "/student/?id=" + params.id).then((res) => {
      setStudent(res.data);
      setGoals(res.data.goals.filter((item) => item.type === "Parent"));
      setComplete(
        res.data.goals.filter(
          (item) => item.type === "Parent" && item.status === "completed"
        )
      );
    });
  }, []);
  /* eslint-enable */
  return (
    <>
      <div className="container profile">
        <div className="card profile">
          <div className="header">
            <div className="title">Student Profile</div>
            <div className="info">
              <div className="image">
                <img src={ServerURL.BASE_URL + student?.image} alt="avatar" />
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
                  {student?.last_login &&
                    moment(student.last_login).format("MMM. DD, YYYY hh:mm")}
                </div>
              </div>
            </div>
            <div className="user-info">
              <div className="name">{student?.name}</div>
              <div className="email">{student?.email}</div>
            </div>
          </div>

          <div className="coins">
            <div className="text">My Coins</div>
            <div className={"circle"}>{student?.coin}</div>
            <div className="redeem">Redeem</div>
          </div>
          <div className="details">
            <div className="change">Change</div>
            <div className="row">
              <div className="text">Grade</div>
              <div className="value">{student?.grade}</div>
            </div>
            <div className="row">
              <div className="text">Gender</div>
              <div className="value">{student?.gender}</div>
            </div>
            <div className="row">
              <div className="text">Athlete</div>
              <div className="value">{student?.athlete ? "Yes" : "No"}</div>
            </div>
            <div className="row">
              <div className="text">College Bound</div>
              <div className="value">
                {student?.college_bound ? "Yes" : "No"}
              </div>
            </div>
            <div className="row">
              <div className="text">Workforce Bound</div>
              <div className="value">
                {student?.workforce_bound ? "Yes" : "No"}
              </div>
            </div>
            <div className="row interests">
              <div className="text">Interests</div>
              <div className="interests">
                {student?.interests?.map((item) => (
                  <div className="interest" key={item}>
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
                <div className="select">
                  <div className="btn">
                    <div className="text parent">Parent</div>
                    <div className="icon">
                      <DownArrow />
                    </div>
                  </div>
                </div>
              </div>
              <div className="progress-line parent">
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
                {student?.rewards?.map((reward) => (
                  <div className="reward">
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
              <div className="title parent">
                <div className="text">Parent</div>
                <div className="icon">
                  <DownArrow />
                </div>
              </div>
            </div>
            <div className="goals">
              {goals.map((goal, index) => (
                <div className="goal-content" key={goal.id}>
                  <div className="goal">
                    <div className="detail">
                      <div className="step">Goal {index + 1}</div>
                      <div className="name">{goal.name}</div>
                    </div>

                    <div className="action">
                      <Link className="btn" to={`/goal/progress/${goal.id}`}>
                        View
                      </Link>
                    </div>
                  </div>
                  <div className={"status " + goal.status}>{goal.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* {modal && (
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
              <div className="circle">25</div>
            </div>
            <div className="rewards">
              <div className="text">Select Reward</div>
              <div className="row">
                {rewards.map((reward) => (
                  <div className="reward" onClick={() => setSelect(reward)}>
                    <div className="image">
                      <img src={reward.image} alt="reward" />
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
      )} */}
    </>
  );
};
