import React, { useEffect, useState } from "react";
import MultiSelect from "../../components/MultiSelect";
import Password from "../../components/Password";
import ServerURL from "../../utils/ServerURL";
import axios from "axios";
import MultiUserSelect from "../../components/MultiUserSelect";
import { useNavigate, useParams } from "react-router-dom";

export const Teacher = () => {
  const params = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [students, setStudents] = useState([]);
  const subjects = ["Math", "Science", "Law", "Gym", "Environmental Science"];
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    role: "teacher",
    level: user.level,
    subject: [],
    image: "",
    gender: "male",
    password: "",
    confirm: "",
    school: user.profile.id,
    students: [],
  });

  const initMessage = {
    name: "",
    email: "",
    school: "",
    password: "",
    confirm: "",
  };
  const [message, setMessage] = useState(initMessage);

  const Upload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      setTeacher({
        ...teacher,
        image: img,
      });
    }
  };

  const require = () => {
    let messages = initMessage;
    if (!teacher.name) messages.name = "This field is required!";
    if (!teacher.email) messages.email = "This field is required!";
    if (!teacher.school) messages.school = "This field is required!";
    if (params.id) {
      if (!teacher.password) messages.password = "This field is required!";
      if (!teacher.confirm) messages.confirm = "This field is required!";
    }

    if (teacher.confirm !== teacher.password)
      messages.confirm = "Password must be match!";
    setMessage(messages);
  };

  const Submit = async (e) => {
    e.preventDefault();
    await require();
    if (params.id) {
      await axios
        .post(ServerURL.BASE_URL + "/teacher/?id=" + params.id, teacher, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch(() => console.error("error"));
    } else {
      const data = {
        ...teacher,
        subject: JSON.stringify(teacher.subject),
      };
      await axios
        .post(ServerURL.BASE_URL + "/teacher/", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch(() => console.error("error"));
    }

    navigate("/teachers");
  };
  /* eslint-disable */
  useEffect(() => {
    axios
      .get(ServerURL.BASE_URL + "/student/?school=" + user.profile.id)
      .then((res) => {
        setStudents(res.data);
      })
      .catch(() => console.error("error"));
    if (params.id) {
      axios
        .get(ServerURL.BASE_URL + "/teacher/?id=" + params.id)
        .then((res) => {
          setTeacher({
            ...res.data,
            school: res.data.school.id,
            students: res.data.students.map((item) => item.id),
            password: "",
          });
        })
        .catch(() => console.error("error"));
    }
  }, []);
  /* eslint-enable */
  return (
    <div className="container">
      <div className="header">
        <div className="title">New Teacher</div>
      </div>
      <div className="card new">
        <div className="form-control">
          <div className="label">Teacher Name</div>
          <div>
            <input
              type="text"
              className="text"
              value={teacher.name}
              onChange={(e) => setTeacher({ ...teacher, name: e.target.value })}
              placeholder="Name"
            />
            <div className="alert-message">{message.name}</div>
          </div>
        </div>
        <div className="form-control">
          <div className="label">Teacher Email</div>
          <div>
            <input
              type="email"
              className="text"
              value={teacher.email}
              onChange={(e) =>
                setTeacher({ ...teacher, email: e.target.value })
              }
              placeholder="Name"
            />
            <div className="alert-message">{message.email}</div>
          </div>
        </div>
        <div className="form-group">
          <div className="form-control">
            <div className="label">Subject(s)</div>
            <MultiSelect
              value={teacher.subject}
              options={subjects}
              add={(val) =>
                !teacher.subject.includes(val) &&
                setTeacher({
                  ...teacher,
                  subject: [...teacher.subject, val],
                })
              }
              remove={(val) =>
                setTeacher({
                  ...teacher,
                  subject: teacher.subject.filter((item) => item !== val),
                })
              }
              removeAll={() => setTeacher({ ...teacher, subject: [] })}
            />
          </div>
        </div>
        <div className="form-control">
          <div className="label">Teacher Profile Picture</div>
          <input className="file" type="file" onChange={Upload} />
          {teacher.image && (
            <img
              src={
                typeof teacher.image === "string"
                  ? ServerURL.BASE_URL + teacher.image
                  : URL.createObjectURL(teacher.image)
              }
              alt="Logo"
            />
          )}
        </div>
        <div className="form-control">
          <div className="label">Gender</div>
          <div className="options">
            <div
              className={
                teacher.gender === "male" ? "option selected" : "option"
              }
              onClick={() => setTeacher({ ...teacher, gender: "male" })}
            >
              Male
            </div>
            <div
              className={
                teacher.gender !== "male" ? "option selected" : "option"
              }
              onClick={() => setTeacher({ ...teacher, gender: "female" })}
            >
              Female
            </div>
          </div>
        </div>
        <div className="form-control">
          <div className="label">Password</div>
          <div>
            <Password
              value={teacher.password}
              onChange={(e) =>
                setTeacher({ ...teacher, password: e.target.value })
              }
              placeholder="Password"
            />
            <div className="alert-message">{message.password}</div>
          </div>
        </div>
        <div className="form-control">
          <div className="label">Confirm Password</div>
          <div>
            <Password
              value={teacher.confirm}
              onChange={(e) =>
                setTeacher({ ...teacher, confirm: e.target.value })
              }
              placeholder="Confirm Password"
            />
            <div className="alert-message">{message.confirm}</div>
          </div>
        </div>
        <div className="form-control">
          <div className="label">Assign to Student(s)</div>
          <MultiUserSelect
            values={teacher.students}
            options={students}
            add={(val) =>
              !teacher.students.includes(val)
                ? setTeacher({
                    ...teacher,
                    students: [...teacher.students, val],
                  })
                : ""
            }
            remove={(val) =>
              setTeacher({
                ...teacher,
                students: teacher.students.filter((item) => item !== val),
              })
            }
            removeAll={() => setTeacher({ ...teacher, students: [] })}
          />
        </div>
        <div className="submit" onClick={Submit}>
          Submit
        </div>
      </div>
    </div>
  );
};
