import React, { useState, useEffect } from "react";
import ServerURL from "../../utils/ServerURL";
import Password from "../../components/Password";
import UserSelect from "../../components/UserSelect";
import MultiUserSelect from "../../components/MultiUserSelect";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export const Parent = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [parent, setParent] = useState({
    name: "",
    email: "",
    image: "",
    gender: "male",
    password: "",
    confirm: "",
    school: "",
    students: [],
    role: "parent",
  });

  const initMessage = {
    name: "",
    email: "",
    school: "",
    password: "",
    confirm: "",
  };

  const [message, setMessage] = useState(initMessage);
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [filterStudents, setFilterStudents] = useState([]);
  const Upload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      setParent({
        ...parent,
        image: img,
      });
    }
  };

  const require = () => {
    let messages = initMessage;
    if (!parent.name) messages["name"] = "This field is required!";
    if (!parent.email) messages["email"] = "This field is required!";
    if (!parent.school) messages["school"] = "This field is required!";
    if (!params.id) {
      if (!parent.password) messages["password"] = "This field is required!";
      if (!parent.confirm) messages["confirm"] = "This field is required!";
    }
    if (parent.confirm !== parent.password)
      messages["confirm"] = "Password must be match!";
    setMessage(messages);
  };

  const Submit = async (e) => {
    e.preventDefault();
    await require();
    if (!params.id) {
      await axios
        .post(ServerURL.BASE_URL + "/parent/", parent, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch(() => console.log("error"));
    } else {
      await axios
        .post(ServerURL.BASE_URL + "/parent/?id=" + params.id, parent, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch(() => console.error("error"));
    }
    navigate("/parents");
  };
  /* eslint-disable */
  useEffect(() => {
    axios
      .get(ServerURL.BASE_URL + "/school/")
      .then((res) => {
        setSchools(res.data);
      })
      .catch(() => console.error("error"));
    axios
      .get(ServerURL.BASE_URL + "/student/")
      .then((res) => {
        setStudents(res.data);
        setFilterStudents(res.data);
      })
      .catch(() => console.error("error"));
    if (params.id) {
      axios
        .get(ServerURL.BASE_URL + "/parent/?id=" + params.id)
        .then((res) => {
          const data = {
            ...res.data,
            school: res.data.school.id,
            students: res.data.students.map((item) => item.id),
          };
          setParent(data);
        })
        .catch(() => console.error("error"));
    }
  }, []);

  useEffect(() => {
    setFilterStudents(
      students.filter((item) => item.school.id === parent.school)
    );
  }, [parent.school]);
  /* eslint-enable */
  return (
    <div className="container">
      <div className="header">
        <div className="title">{params.id ? "Edit" : "New"} Parent</div>
      </div>
      <div className="card new">
        <div className="form-control">
          <div className="label">Parent Name</div>
          <div>
            <input
              type="text"
              className="text"
              value={parent.name}
              onChange={(e) => setParent({ ...parent, name: e.target.value })}
              placeholder="Name"
            />
            <div className="alert-message">{message.name}</div>
          </div>
        </div>
        <div className="form-control">
          <div className="label">Parent Email</div>
          <div>
            <input
              type="text"
              className="text"
              value={parent.email}
              onChange={(e) => setParent({ ...parent, email: e.target.value })}
              placeholder="Email"
            />
            <div className="alert-message">{message.email}</div>
          </div>
        </div>
        <div className="form-control">
          <div className="label">Parent Profile Picture</div>
          <input className="file" id="file" type="file" onChange={Upload} />
          {parent.image && (
            <img
              src={
                typeof parent.image === "string"
                  ? ServerURL.BASE_URL + parent.image
                  : URL.createObjectURL(parent.image)
              }
              alt="Student"
            />
          )}
        </div>
        <div className="form-group">
          <div className="form-control">
            <div className="label">Gender</div>
            <div className="options">
              <div
                className={
                  parent.gender === "male" ? "option selected" : "option"
                }
                onClick={() => setParent({ ...parent, gender: "male" })}
              >
                Male
              </div>
              <div
                className={
                  parent.gender !== "male" ? "option selected" : "option"
                }
                onClick={() => setParent({ ...parent, gender: "female" })}
              >
                Female
              </div>
            </div>
          </div>
        </div>
        <div className="form-control">
          <div className="label">Password</div>
          <div>
            <Password
              value={parent.password}
              onChange={(e) =>
                setParent({ ...parent, password: e.target.value })
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
              value={parent.confirm}
              onChange={(e) =>
                setParent({ ...parent, confirm: e.target.value })
              }
              placeholder="Confirm Password"
            />
            <div className="alert-message">{message.confirm}</div>
          </div>
        </div>
        <div className="form-control">
          <div className="label">Assign to School</div>
          <div>
            <UserSelect
              value={parent.school}
              options={schools}
              onChange={(val) => setParent({ ...parent, school: val })}
            />
            <div className="alert-message">{message.school}</div>
          </div>
        </div>
        <div className="form-control">
          <div className="label">Assign to Student</div>
          <MultiUserSelect
            values={parent.students}
            options={filterStudents}
            add={(val) =>
              !parent.students.includes(val)
                ? setParent({
                    ...parent,
                    students: [...parent.students, val],
                  })
                : ""
            }
            remove={(val) =>
              setParent({
                ...parent,
                students: parent.students.filter((item) => item !== val),
              })
            }
            removeAll={() => setParent({ ...parent, students: [] })}
          />
        </div>
        <div className="submit" onClick={Submit}>
          Submit
        </div>
      </div>
    </div>
  );
};
