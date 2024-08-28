import React, { useEffect, useState } from "react";
import Select from "../../components/Select";
import CountrySelect from "../../components/CountrySelect";
import Password from "../../components/Password";
import ServerURL from "../../utils/ServerURL";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export const School = () => {
  const params = useParams();
  const navigate = useNavigate();
  const levels = ["Elementary School", "Middle School", "High School"];
  const [countries, setCountries] = useState([]);

  const [school, setSchool] = useState({
    name: "",
    contact: "",
    email: "",
    role: "school",
    contact_2: "",
    email_2: "",
    level: levels[0],
    image: "",
    address: "",
    extras: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    password: "",
    confirm: "",
  });
  const initMessage = {
    name: "",
    contact: "",
    email: "",
    password: "",
    confirm: "",
  };

  const [message, setMessage] = useState(initMessage);

  const Upload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      setSchool({
        ...school,
        image: img,
      });
    }
  };

  const require = () => {
    let messages = initMessage;
    if (!school.name) messages["name"] = "This field is required!";
    if (!school.email) messages["email"] = "This field is required!";
    if (params.id) {
      if (!school.password) messages.password = "This field is required!";
      if (!school.confirm) messages.confirm = "This field is required!";
    }
    if (school.confirm !== school.password)
      messages.confirm = "Password must be match!";

    setMessage(messages);
  };

  const Submit = async () => {
    await require();
    if (params.id) {
      await axios
        .post(ServerURL.BASE_URL + "/school/?id=" + params.id, school, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch(() => console.error("error"));
    } else {
      await axios
        .post(ServerURL.BASE_URL + "/school/", school, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch(() => console.error("error"));
    }
    navigate("/schools");
  };
  /* eslint-disable */
  useEffect(() => {
    if (params.id) {
      axios
        .get(ServerURL.BASE_URL + "/school/?id=" + params.id)
        .then((res) => setSchool(res.data))
        .catch(() => console.error("error"));
    }
    axios
      .get("https://valid.layercode.workers.dev/list/countries?format=select")
      .then((res) => setCountries(res.data.countries));
  }, []);
  /* eslint-disable */

  return (
    <div className="container">
      <div className="header">
        <div className="title">{params.id ? "Edit" : "New"} School</div>
      </div>
      <div className="card new">
        <div className="form-control">
          <div className="label">School Name</div>
          <div>
            <input
              type="text"
              className="text"
              value={school.name}
              onChange={(e) => setSchool({ ...school, name: e.target.value })}
              placeholder="School Name"
            />
            <div className="alert-message">{message.name}</div>
          </div>
        </div>
        <div className="form-control">
          <div className="label">Contact 1</div>
          <div>
            <input
              type="text"
              className="text"
              value={school.contact}
              onChange={(e) =>
                setSchool({ ...school, contact: e.target.value })
              }
            />
            <div className="alert-message">{message.contact}</div>
          </div>
        </div>
        <div className="form-control">
          <div className="label">Contact Email</div>
          <div>
            <input
              type="email"
              className="text"
              value={school.email}
              onChange={(e) => setSchool({ ...school, email: e.target.value })}
            />
            <div className="alert-message">{message.email}</div>
          </div>
        </div>
        <div className="form-control">
          <div className="label">Contact 2</div>
          <input
            type="text"
            className="text"
            value={school.contact_2}
            onChange={(e) =>
              setSchool({ ...school, contact_2: e.target.value })
            }
          />
        </div>
        <div className="form-control">
          <div className="label">Contact Email</div>
          <input
            type="email"
            className="text"
            value={school.email_2}
            onChange={(e) => setSchool({ ...school, email_2: e.target.value })}
          />
        </div>
        <div className="form-group">
          <div className="form-control">
            <div className="label">School Level</div>
            <Select
              value={school.level}
              options={levels}
              onChange={(val) => setSchool({ ...school, level: val })}
            />
          </div>
          <div className="form-control">
            <div className="label">School Logo</div>
            <input className="file" type="file" onChange={Upload} />
            {school.image && (
              <img
                src={
                  typeof school.image === "string"
                    ? ServerURL.BASE_URL + school.image
                    : URL.createObjectURL(school.image)
                }
                alt="Logo"
              />
            )}
          </div>
        </div>
        <div className="form-control">
          <div className="label">Location</div>
          <div className="group">
            <input
              type="text"
              className="text"
              value={school.address}
              onChange={(e) =>
                setSchool({ ...school, address: e.target.value })
              }
              placeholder="Street Address"
            />
            <input
              type="text"
              className="text"
              value={school.extras}
              onChange={(e) => setSchool({ ...school, extras: e.target.value })}
              placeholder="Extras: Appt #, Floor, Unit, Etc..."
            />
          </div>
        </div>
        <div className="form-control">
          <div className="group">
            <input
              type="text"
              className="text"
              value={school.city}
              onChange={(e) => setSchool({ ...school, city: e.target.value })}
              placeholder="City"
            />
            <input
              type="text"
              className="text"
              value={school.state}
              onChange={(e) => setSchool({ ...school, state: e.target.value })}
              placeholder="State"
            />
          </div>
        </div>
        <div className="form-control">
          <div className="group">
            <CountrySelect
              value={school.country}
              options={countries}
              onChange={(val) => setSchool({ ...school, country: val })}
              placeholder="Country"
            />
            <div className="select">
              <input
                type="text"
                className="text"
                value={school.zipcode}
                onChange={(e) =>
                  setSchool({ ...school, zipcode: e.target.value })
                }
                placeholder="ZipCode"
              />
            </div>
          </div>
        </div>
        <div className="form-control">
          <div className="label">Password</div>
          <div>
            <Password
              value={school.password}
              onChange={(e) =>
                setSchool({ ...school, password: e.target.value })
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
              value={school.confirm}
              onChange={(e) =>
                setSchool({ ...school, confirm: e.target.value })
              }
              placeholder="Confirm Password"
            />
            <div className="alert-message">{message.confirm}</div>
          </div>
        </div>
        <div className="submit" onClick={Submit}>
          Submit
        </div>
      </div>
    </div>
  );
};
