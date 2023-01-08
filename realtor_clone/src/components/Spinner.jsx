import React from "react";
import spinner from "../assets/svg/spinner.svg";

export default function Spinner() {
  return (
    <div className="bg-black bg-opacity-50 h-screen flex items-center justify-center z-20 ">
      <div>
        <img src={spinner} alt="Loading ..." className="h-20" />
      </div>
    </div>
  );
}
