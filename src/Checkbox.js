import React, { Component } from "react";

const Checkbox = ({ handleCheckboxChange, label, selected }) => {
  return (
    <div className="checkbox">
      <label>
        <input
          type="checkbox"
          value={label}
          checked={selected}
          onChange={() => handleCheckboxChange(label)}
        />
        <p>{label}</p>
      </label>
    </div>
  );
};

export default Checkbox;
