import React, { useState, useEffect } from "react";
import { ReactComponent as XIcon } from "../../assets/Icons/X.svg";
import Select from "../../components/Select";
import ServerURL from "../../utils/ServerURL";
import DatePicker from "../../components/DatePicker";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import GoalSelect from "../../components/GoalSelect";

export const Goal = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const types = ["Behavioral", "Academic"];

  const [goal, setGoal] = useState({
    start_date: "",
    end_date: "",
    type: "Behavioral",
    score: "",
    goal: null,
    reporter: user.id,
    student: "",
    name: "",
    responses: [],
  });

  const [goals, setGoals] = useState([]);
  const [students, setStudents] = useState([]);
  const [filterStudents, setFilterStudents] = useState([]);
  const [responses, setResponses] = useState([""]);
  const init = {
    start_date: "",
    end_date: "",
    student: "",
  };
  const [message, setMessage] = useState(init);

  const onChangeScore = (e) => {
    let val = e.target.value;
    if (val > 100) val = 100;
    if (val < 0) val = 0;
    const num = parseFloat(val).toFixed(4);
    setGoal({ ...goal, score: num });
  };

  const NewResponse = () => {
    setResponses([...responses, ""]);
  };

  const Search = (e) => {
    const term = e.target.value;
    const filter = students.filter((item) => item.name.includes(term));
    setFilterStudents(filter);
  };

  /* eslint-disable */
  const params = useParams();
  useEffect(() => {
    if (params.id) {
      axios
        .get(ServerURL.BASE_URL + "/goal/?id=" + params.id)
        .then((res) => {
          setGoal({
            ...res.data,
            student: res.data.student.id,
            score: res.data.score.toFixed(4),
          });
        })
        .catch(() => console.error("error"));
    }
    axios
      .get(ServerURL.BASE_URL + "/student/?teacher=" + user.profile.id)
      .then((res) => {
        setStudents(res.data);
        setFilterStudents(res.data);
      })
      .catch(() => console.error("error"));
    axios
      .get(ServerURL.BASE_URL + "/goals/?user=" + user.id)
      .then((res) => setGoals(res.data))
      .catch(() => console.error("error"));
  }, []);
  /* eslint-enable */

  const Submit = async () => {
    let messages = init;
    if (!goal.start_date) messages["start_date"] = "This field is required!";
    if (!goal.end_date) messages["end_date"] = "This field is required!";
    if (!goal.student) messages["student"] = "This field is required!";
    setMessage(messages);
    if (messages !== init) return;
    let data = goal;

    if (goal.goal) {
      data = { ...goal, responses: [], name: "" };
    } else {
      data = { ...goal, responses: responses };
    }
    data["start_date"] = moment(goal.start_date).format("YYYY-MM-DD");
    data["end_date"] = moment(goal.end_date).format("YYYY-MM-DD");
    if (params.id) {
      await axios
        .post(ServerURL.BASE_URL + "/goal/?id=" + goal.id, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch(() => console.error("error"));
    } else {
      await axios
        .post(ServerURL.BASE_URL + "/goal/", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch(() => console.error("error"));
    }

    navigate("/goals");
  };

  const onChange = (value, index) => {
    let res = responses;
    res[index] = value;
    setResponses(res);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">New Goal</div>
      </div>
      <div className="card new">
        <div className="form-group">
          <div className="form-control">
            <div className="label">Goal Date From</div>
            <div>
              <DatePicker
                value={goal.start_date}
                max={goal.end_date}
                onChange={(e) =>
                  setGoal({ ...goal, start_date: e.target.value })
                }
              />
              <div className="alert-message">{message.start_date}</div>
            </div>
          </div>
          <div className="form-control">
            <div className="label">Goal Date To</div>
            <DatePicker
              value={goal.end_date}
              min={goal.start_date}
              onChange={(e) => setGoal({ ...goal, end_date: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <div className="form-control">
            <div className="label">Goal Type</div>
            <Select
              value={goal.type}
              options={types}
              onChange={(val) => setGoal({ ...goal, type: val })}
              placeholder="Select Goal"
            />
          </div>
          <div className="form-control">
            <div className="label">Average Score Goal</div>
            <div className="date">
              <input
                type="number"
                min={0}
                max={100}
                value={goal.score}
                placeholder="--.----"
                onChange={(e) => setGoal({ ...goal, score: e.target.value })}
                onMouseLeave={(e) => onChangeScore(e)}
              />
              <div
                className="icon"
                onClick={() => setGoal({ ...goal, score: "" })}
              >
                <XIcon />
              </div>
            </div>
          </div>
        </div>
        <div className="form-control">
          <div className="label">Goal Bank</div>
          <GoalSelect
            value={goal.goal}
            options={goals}
            placeholder="Select Goal"
            onChange={(val) => setGoal({ ...goal, goal: val })}
          />
        </div>
        <div className="or">Or</div>
        <div className="form-control">
          <div className="label">Goal</div>
          <textarea
            className="goal"
            placeholder="Goal"
            value={goal.name}
            onChange={(e) => setGoal({ ...goal, name: e.target.value })}
          />
        </div>

        <div className="form-control" id="responses">
          <div className="label">Responses</div>
          {responses.map((response, index) => (
            <textarea
              className="response"
              placeholder="Type Response"
              value={response}
              onChange={(e) => onChange(e.target.value, index)}
            />
          ))}
        </div>
        <div className="btn response" onClick={NewResponse}>
          <div className="text">New Response</div>
          <div className="plus">+</div>
        </div>
        <div className="form-control">
          <div className="header">
            <div className="label">
              <div className="">Assign To:</div>
              <div className="underline">Student</div>
            </div>
            <div className="search">
              <input
                type="text"
                placeholder="Type a new message"
                onChange={Search}
              />
              <div className="search-icon">
                <div className="icon" />
              </div>
            </div>
          </div>
          <div className="table">
            <div className="row header">
              <div className="select">Select</div>
              <div className="name">Customer Name</div>
              <div className="email">Email</div>
            </div>
            {filterStudents.map((item, index) => (
              <div className="row" key={index}>
                <div className="select">
                  <input
                    type="radio"
                    name="students"
                    onChange={() =>
                      setGoal({
                        ...goal,
                        student: item.id,
                      })
                    }
                    value={item.id}
                    checked={item.id === goal.student}
                  />
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
