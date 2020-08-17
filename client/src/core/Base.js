import React from "react";

const Base = ({ title, description }) => {
  return (
    <div>
      <div
        style={{ height: "100px" }}
        className="bg-dark pt-3">
        <h2 className="text-center text-white h1">{title}</h2>
      </div>
    </div>
  );
};

export default Base;
