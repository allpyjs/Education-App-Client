import React, { useEffect, useState } from "react";
import moment from "moment";
import { ReactComponent as PrintIcon } from "../../assets/Icons/Print - New Gray.svg";
import { ReactComponent as GoalIcon } from "../../assets/Icons/Goals.svg";
import { ReactComponent as XIcon } from "../../assets/Icons/X.svg";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import ServerURL from "../../utils/ServerURL";
import { useParams } from "react-router-dom";
import axios from "axios";

export const Progress = () => {
  const params = useParams();
  const [width, setWidth] = useState(600);
  const [open, setOpen] = useState(false);

  const [data, setData] = useState([]);
  const [select, setSelect] = useState({});
  const [goal, setGoal] = useState({});
  const [student, setStudent] = useState();
  const [complete, setComplete] = useState({});
  const dateFormatter = (date) => {
    return moment(new Date(date + " 01:00:00")).format("MMM DD");
  };
  const dotClick = (e) => {
    const { payload } = e;
    const note = goal?.records?.find((item) => (item.date = payload.date)).note;
    setSelect({
      date: payload.date,
      value: payload.value,
      note: note,
    });
  };

  const confirm = () => {
    setOpen(false);
  };

  const fetch = () => {
    axios
      .get(ServerURL.BASE_URL + "/goal/?id=" + params.id)
      .then((res) => {
        setGoal(res.data);
        fetchTableData(res.data);
        setStudent(res.data.student);
      })
      .catch(() => console.error("error"));
    axios
      .get(ServerURL.BASE_URL + "/complete/?goal=" + params.id)
      .then((res) => setComplete(res.data))
      .catch(() => console.error("error"));
  };

  const fetchTableData = (goal) => {
    const record = [];
    record.push({
      date: goal?.start_date,
      val1: 10,
      val2: 20,
      val3: 30,
      val4: 40,
      val5: 50,
      val6: 60,
      val7: 70,
      val8: 80,
      val9: 90,
      val10: 100,
    });
    goal?.records?.forEach((item) => {
      record.push({
        date: item.date,
        value: item.score,
        val1: 10,
        val2: 20,
        val3: 30,
        val4: 40,
        val5: 50,
        val6: 60,
        val7: 70,
        val8: 80,
        val9: 90,
        val10: 100,
      });
    });

    record.push({
      date: goal?.end_date,
      val1: 10,
      val2: 20,
      val3: 30,
      val4: 40,
      val5: 50,
      val6: 60,
      val7: 70,
      val8: 80,
      val9: 90,
      val10: 100,
    });
    setData(record);
  };
  const updateSize = () => {
    if (window.innerWidth > 1250) {
      const w = window.innerWidth - 800;
      setWidth(w);
    } else if (window.innerWidth > 892) {
      const w = window.innerWidth - 530;
      setWidth(w);
    } else if (window.innerWidth > 640) {
      const w = window.innerWidth - 330;
      setWidth(w);
    } else {
      const w = window.innerWidth - 105;
      setWidth(w);
    }
  };
  /* eslint-disable */
  useEffect(() => {
    fetch();
    updateSize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  /* eslint-enable */

  const getProgress = (start_date, end_date) => {
    const time = new Date().getTime();
    const end = new Date(end_date).getTime();
    const start = new Date(start_date).getTime();
    if (time < start) return "0%";
    if (time > end) return "100%";
    const percent = ((100 * (time - start)) / (end - start)).toFixed(0) + "%";
    return percent;
  };
  return (
    <>
      <div className="container profile progress">
        <div className="card profile progress">
          <div className="header">
            <div className="title">Progress Monitoring</div>
            <div className="info">
              <div className="image">
                {student?.image && (
                  <img src={ServerURL.BASE_URL + student?.image} alt="avatar" />
                )}
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
                    moment(student?.last_login).format("MMM. DD, YYYY hh:mm")}
                </div>
              </div>
            </div>
            <div className="user-info">
              <div className="name">{student?.name}</div>
              <div className="email">{student?.email}</div>
            </div>
          </div>
          <div className="goal-details">
            <div className="detail">
              <div className="text">{goal.type}</div>
              <div className="value">Goal {goal.id}</div>
            </div>
            <div className="detail col">
              <div className="text">Goal Name</div>
              <div className="value">{goal?.name}</div>
            </div>
            <div className="detail">
              <div className="text">Coin Value</div>
              <div className="value">{student?.coin}</div>
            </div>
          </div>
          <div className="details">
            <div className="description">
              <div className="date">
                Completion Date:{" "}
                {goal?.end_date &&
                  moment(new Date(goal?.end_date + " 01:00:00")).format(
                    "MM/DD/YYYY"
                  )}
              </div>
              <div className="text">
                Administration and or teacher identifies students who need more
                intervention support than what the School wide Positive Behavior
                Intervention Support (PBIS) -a framework for supporting
                students’ behavioral, academic, ocial,emotional, and mental
                health can offer.
              </div>
            </div>

            <div className="progress-line">
              <div className="line">
                <div
                  className="progress"
                  style={{
                    width: getProgress(goal?.start_date, goal?.end_date),
                  }}
                />
              </div>
              <div className="text">
                {goal && getProgress(goal?.start_date, goal?.end_date)}
              </div>
            </div>
          </div>
          <div
            className="btn complete"
            onClick={() => goal?.status === "completed" && setOpen(true)}
          >
            {goal?.status}
          </div>
        </div>
        <div className="card">
          <div className="header">
            <div className="left">
              <div className="title">Progress Chart</div>
            </div>
            <div className="right">
              <div className="btn">
                <div className="text">Print</div>
                <div className="icon">
                  <PrintIcon />
                </div>
              </div>
              <div className="btn">
                <div className="text">Export</div>
                <div className="icon">
                  <GoalIcon />
                </div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="details">
              <div className="date detail">
                <div className="text">Entry Date From</div>
                <div className="btn">
                  <div className="date">
                    {goal &&
                      moment(new Date(goal?.start_date + " 01:00:00")).format(
                        "MM/DD/YYYY"
                      )}
                  </div>
                  <div className="icon">
                    <XIcon />
                  </div>
                </div>
              </div>
              <div className="date detail">
                <div className="text">Entry Date To</div>
                <div className="btn">
                  <div className="date">
                    {goal &&
                      moment(new Date(goal?.end_date + " 01:00:00")).format(
                        "MM/DD/YYYY"
                      )}
                  </div>
                  <div className="icon">
                    <XIcon />
                  </div>
                </div>
              </div>
            </div>
            <div className="gray-container">
              <div className="graph">
                <LineChart width={width} height={360} data={data}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={dateFormatter}
                    fontSize={13}
                    fontFamily="Poppins"
                    fontWeight={500}
                    letterSpacing={0}
                    stroke="#003595"
                    tickSize={0}
                    tickMargin={10}
                  />
                  <YAxis
                    fontSize={13}
                    fontFamily="Poppins"
                    fontWeight={500}
                    letterSpacing={0}
                    stroke="#003595"
                    tickSize={0}
                    tickMargin={10}
                    spacing={30}
                  ></YAxis>
                  <Line
                    dataKey="value"
                    stroke="#913A7E"
                    strokeWidth="3"
                    activeDot={{ r: 8 }}
                    dot={{
                      onClick: dotClick,
                      strokeWidth: 1,
                      r: 4,
                      stroke: "#003595",
                      cursor: "pointer",
                    }}
                  />
                  <Line dataKey="val1" stroke="#707070" className="straight" />
                  <Line dataKey="val2" stroke="#707070" className="straight" />
                  <Line dataKey="val3" stroke="#707070" className="straight" />
                  <Line dataKey="val4" stroke="#707070" className="straight" />
                  <Line dataKey="val5" stroke="#707070" className="straight" />
                  <Line dataKey="val6" stroke="#707070" className="straight" />
                  <Line dataKey="val7" stroke="#707070" className="straight" />
                  <Line dataKey="val8" stroke="#707070" className="straight" />
                  <Line dataKey="val9" stroke="#707070" className="straight" />
                  <Line dataKey="val10" stroke="#707070" className="straight" />
                </LineChart>
              </div>
              <div className="description">
                <div className="date">
                  {moment(select.date).format("MMM D, YYYY")}
                </div>
                <div className="details">
                  <div className="detail">
                    <div className="text bold">Status:</div>
                    <div className="text medium">Satisfactory</div>
                  </div>
                </div>
                <div className="details">
                  <div className="text bold">Notes:</div>
                  <div className="text">{select.note}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="records">
            <div className="table">
              <div className="row ">
                <div className="col line">
                  <div className="row thead">Line</div>
                  {goal?.records?.map((rec, index) => (
                    <div className="row tbody" key={index}>
                      {index + 1}
                    </div>
                  ))}
                  <div className="row tbody" />
                </div>
                <div className="col date">
                  <div className="row thead">Date</div>
                  {goal?.records?.map((rec, index) => (
                    <div className="row tbody" key={index}>
                      {moment(new Date(rec.date + " 08:00:00")).format(
                        "MM/DD/YYYY"
                      )}
                    </div>
                  ))}
                  <div className="row tbody" />
                </div>
                <div className="col score">
                  <div className="row thead">Score</div>
                  {goal?.records?.map((rec, index) => (
                    <div className="row tbody" key={index}>
                      {rec.score.toFixed(4)}
                    </div>
                  ))}
                  <div className="row tbody" />
                </div>
                <div className="col notes">
                  <div className="row thead">Notes</div>
                  {goal?.records?.map((rec, index) => (
                    <div className="row tbody" key={index}>
                      {rec.note}
                    </div>
                  ))}
                  <div className="row tbody" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {open && (
        <div className="modal">
          <div className="card modal-main">
            <div className="header">
              <div className="title">Complete Goal</div>
              <div className="btn" onClick={() => setOpen(false)}>
                Close
              </div>
            </div>
            <div className="coins">
              <div className="text">Maximum Coins Available</div>
              <div className="circle">3</div>
            </div>
            <div className="rewards coins">
              <div className="text">Select Coins Earned</div>
              <div className="coins large-text bold">
                <div className={complete.coin === 1 ? "coin active" : "coin"}>
                  1
                </div>
                <div className={complete.coin === 2 ? "coin active" : "coin"}>
                  2
                </div>
                <div className={complete.coin === 3 ? "coin active" : "coin"}>
                  3
                </div>
              </div>
              <div className="explain">
                <div className="text bold">Explaination of Coins Earned</div>
                <div>{complete.explain}</div>
              </div>
            </div>

            <div className="btn-group">
              <div className="btn deny" onClick={() => setOpen(false)}>
                Cancel
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
