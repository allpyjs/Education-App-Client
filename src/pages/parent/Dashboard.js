import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Dashboard = ({ show }) => {
  return (
    <div className="container">
      <div className="blue text">
        <div className="title">
          Welcome back <span>Stephanie</span>
        </div>
        <div className="text bold">
          Suize is on their way to <span className="bold">victory!</span>
        </div>
      </div>
      <div className="details parent">
        <div className="card grow">
          <Link className="btn" to="/goals">
            Setup Goals
          </Link>
        </div>
        <div className="card grow">
          <Link to="/tracking" className="btn">
            Track Progress
          </Link>
        </div>
        <div className="card grow">
          <Link to="/students" className="btn">
            My Student
          </Link>
        </div>
        <div className="card grow">
          <Link to="/messages" className="btn">
            Messages
          </Link>
        </div>
      </div>
    </div>
  );
};
