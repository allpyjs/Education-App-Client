import React, { useEffect, useState } from "react";

const ProgressLine = ({ goals = [] }) => {
  const [type, setType] = useState("Behavioral");
  const [goal, setGoal] = useState([]);
  const [complete, setComplete] = useState([]);
  /* eslint-disable */
  useEffect(() => {
    setGoal(goals.filter((item) => item.type === type));
    setComplete(
      goals.filter((item) => item.type === type && item.status === "completed")
    );
  }, [type]);
  /* eslint-ensable */

  return (
    <div className={"progress " + type}>
      <div className="type">
        <div
          className={type === "Behavioral" ? "Behavioral bold" : "Behavioral"}
          onClick={() => setType("Behavioral")}
        >
          B
        </div>
        <div
          className={type === "Academic" ? "Academic bold" : "Academic"}
          onClick={() => setType("Academic")}
        >
          A
        </div>
        <div
          className={type === "Parent" ? "Parent bold" : "Parent"}
          onClick={() => setType("Parent")}
        >
          P
        </div>
      </div>

      <div className="progress-line">
        <div className="line">
          <div
            className={"color-line " + type}
            style={{
              width: goal?.length
                ? 100 * (complete?.length / goal?.length) + "%"
                : "",
            }}
          />
        </div>

        <div className="text">
          {complete?.length} of {goal?.length}
        </div>
      </div>
    </div>
  );
};

export default ProgressLine;
