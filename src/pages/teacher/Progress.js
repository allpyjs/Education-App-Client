import React, { useEffect, useState } from "react";
import moment from "moment";
import { ReactComponent as PrintIcon } from "../../assets/Icons/Print - New Gray.svg";
import { ReactComponent as GoalIcon } from "../../assets/Icons/Goals.svg";
import { ReactComponent as XIcon } from "../../assets/Icons/X.svg";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import ServerURL from "../../utils/ServerURL";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Select from "../../components/Select";

export const Progress = () => {
  const [width, setWidth] = useState();
  const params = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const [select, setSelect] = useState({});
  const [goals, setGoals] = useState([]);
  const [goal, setGoal] = useState({});
  const [record, setRecord] = useState();
  const [index, setIndex] = useState(0);
  const [student, setStudent] = useState({});
  const [complete, setComplete] = useState({ coin: 0, explain: "" });
  const dateFormatter = (date) => {
    return moment(new Date(date + " 01:00:00")).format("MMM DD");
  };
  const dotClick = (e) => {
    const { payload } = e;
    const note = goal.records?.find((item) => item.date === payload.date).note;
    setSelect({
      date: payload.date,
      value: payload.value,
      note: note,
    });
  };

  const handleComplete = async () => {
    const data = {
      ...complete,
      goal: goal.id,
    };
    axios
      .post(ServerURL.BASE_URL + "/complete/", data)
      .then(() => navigate("students"))
      .catch(() => console.error("error"));
  };

  const fetchTableData = (data) => {
    const record = [];

    const start = record.filter((item) => item.date === data?.start_date);
    const end = data?.records?.filter((item) => item.date === data?.end_date);
    if (start.length < 1) {
      record.push({
        date: data?.start_date,
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
    }
    data?.records?.forEach((item) => {
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
    if (end?.length < 1) {
      record.push({
        date: data?.end_date,
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
    }
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
    axios
      .get(ServerURL.BASE_URL + "/goal/?student=" + params.id)
      .then((res) => {
        setGoals(res.data);
        setGoal(res.data[index]);
        let data = [];

        fetchTableData(res.data[index]);
        setSelect({
          date: res.data[index]?.start_date,
          note: `Administration and or teacher identifies students who need more
        intervention support than what the School wide Positive Behavior
        Intervention Support (PBIS) -a framework for supporting
        students’ behavioral, academic, ocial,emotional, and mental
        health can offer.`,
        });
      });
  }, [modalOpen, loading]);

  useEffect(() => {
    let data = [];
    setGoal(goals[index]);

    goals[index]?.records.map((item) =>
      data.push({
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
      })
    );
    data.push({
      date: goals[index]?.start_date,
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
    data.push({
      date: goals[index]?.end_date,
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
    setData(data.sort((a, b) => new Date(a.date) < new Date(b.date)));
  }, [index]);

  useEffect(() => {
    axios
      .get(ServerURL.BASE_URL + "/student/?id=" + params.id)
      .then((res) => setStudent(res.data))
      .catch(() => console.error("error"));
    updateSize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);
  /* eslint-enable */
  const NewRecord = () => {
    setRecord({
      score: "",
      note: "",
    });
    setModalOpen(false);
  };

  const Undo = () => {
    setLoading(true);
    axios
      .delete(ServerURL.BASE_URL + "/record/?id=" + record.id)
      .then(() => setLoading(false))
      .catch(() => console.error("error"));
  };

  const getProgress = (start_date, end_date) => {
    const time = new Date().getTime();
    const end = new Date(end_date).getTime();
    const start = new Date(start_date).getTime();
    if (time < start) return "0%";
    if (time > end) return "100%";
    const percent = ((100 * (time - start)) / (end - start)).toFixed(0) + "%";
    return percent;
  };

  const addRecord = async () => {
    const data = {
      ...record,
      goal: goals[index].id,
    };
    try {
      await axios.post(ServerURL.BASE_URL + "/record/", data);
      setModalOpen(false);
    } catch {
      console.error("error");
    }
  };

  const handleChangeScore = (val) => {
    if (val > 100) val = 100;
    if (val < 0) val = 0;
    setRecord({
      ...record,
      score: val,
    });
  };
  return (
    <>
      <div className="container profile">
        <div className="card profile progress">
          <div className="header">
            <div className="title">Progress Monitoring</div>
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
              <div className="text">{goal ? goal.type : "Behavioral"}</div>
              <div className="value">
                <Select
                  text="Goal "
                  value={goals.length > 0 ? index + 1 : ""}
                  options={goals?.map((item, index) => index + 1)}
                  onChange={(val) => setIndex(val - 1)}
                />
              </div>
            </div>
            <div className="detail col">
              <div className="text">Goal Name</div>
              <div className="value">{goals[index]?.name}</div>
            </div>
            <div className="detail">
              <div className="text">Coin Value</div>
              <div className="value">{goals[index]?.student?.coin}</div>
            </div>
          </div>
          <div className="details">
            <div className="description">
              <div className="date">
                Completion Date:{" "}
                {goal?.end_date
                  ? moment(new Date(goal.end_date + " 01:00:00")).format(
                      "MM/DD/YYYY"
                    )
                  : ""}
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
                    width: goal
                      ? getProgress(goal?.start_date, goal?.end_date)
                      : "",
                  }}
                />
              </div>
              <div className="text">
                {goal ? getProgress(goal?.start_date, goal?.end_date) : "0%"}
              </div>
            </div>
          </div>
          <div className="btn complete" onClick={() => setOpen(true)}>
            Complete
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
                    {goal
                      ? moment(new Date(goal?.start_date + " 01:00:00")).format(
                          "MM/DD/YYYY"
                        )
                      : ""}
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
                    {goal
                      ? moment(
                          new Date(goals[index]?.end_date + " 01:00:00")
                        ).format("MM/DD/YYYY")
                      : ""}
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
            <div className="record-header">
              <div className="btn-group">
                <div
                  className="btn fill"
                  onClick={() => goal && setModalOpen(true)}
                >
                  Update
                </div>
                <div className="btn" onClick={goal && Undo}>
                  Undo
                </div>
              </div>
              <div className="btn" onClick={() => goal && NewRecord()}>
                <div className="text">New Record</div>
                <div className="icon">+</div>
              </div>
            </div>
            <div className="table">
              <div className="row ">
                <div className="col select">
                  <div className="row thead">
                    <XIcon />
                  </div>
                  {goal?.records?.map((rec, index) => (
                    <div className="row tbody" key={index}>
                      <input
                        type="radio"
                        name="record"
                        value={index}
                        onChange={() => setRecord(rec)}
                      />
                    </div>
                  ))}
                  <div className="row tbody" />
                </div>
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
          <div className="modal-main card">
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
                <div
                  className={complete.coin === 1 ? "coin active" : "coin"}
                  onClick={() => setComplete({ ...complete, coin: 1 })}
                >
                  1
                </div>
                <div
                  className={complete.coin === 2 ? "coin active" : "coin"}
                  onClick={() => setComplete({ ...complete, coin: 2 })}
                >
                  2
                </div>
                <div
                  className={complete.coin === 3 ? "coin active" : "coin"}
                  onClick={() => setComplete({ ...complete, coin: 3 })}
                >
                  3
                </div>
              </div>
              <div className="explain">
                <div className="text bold">Explaination of Coins Earned</div>
                <textarea
                  placeholder="Explanation for Coins Earned"
                  value={complete.explain}
                  onClick={(e) =>
                    setComplete({ ...complete, explain: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="btn-group">
              <div className="btn deny" onClick={() => setOpen(false)}>
                Cancel
              </div>
              <div className="btn confirm" onClick={() => handleComplete()}>
                Confirm
              </div>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="modal">
          <div className="card modal-main">
            <div className="header">
              <div className="title">New Record</div>
              <div className="btn" onClick={NewRecord}>
                Close
              </div>
            </div>
            <div className="record">
              <div className="score">
                <div className="text bold">Score</div>
                <input
                  type="number"
                  className="text"
                  min={0}
                  max={100}
                  value={record?.score}
                  onChange={(e) => handleChangeScore(e.target.value)}
                />
              </div>
              <div className="explain">
                <div className="text bold">Note</div>
                <textarea
                  value={record?.note}
                  onChange={(e) =>
                    setRecord({ ...record, note: e.target.value })
                  }
                  placeholder="Explanation for Coins Earned"
                />
              </div>
            </div>

            <div className="btn-group">
              <div className="btn deny" onClick={() => setModalOpen(false)}>
                Cancel
              </div>
              <div className="btn confirm" onClick={() => addRecord()}>
                Confirm
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
