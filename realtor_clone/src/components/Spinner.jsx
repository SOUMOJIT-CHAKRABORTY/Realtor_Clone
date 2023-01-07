import React from "react";
import spinner from "../assets/svg/spinner.svg";

export default function Spinner() {
  return (
    <div>
      <div>
        <img src={spinner} alt="Loading ..." />
      </div>
    </div>
  );
}
