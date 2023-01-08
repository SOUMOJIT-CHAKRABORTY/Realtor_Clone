import React from "react";
import { useState } from "react";

export default function CreateListing() {
  const [formData, setFormData] = useState({
    type: "rent",
  });
  const { type } = formData;
  function onChange() {}
  return (
    <main className="mx-auto px-2 max-w-md">
      <h1 className="text-3xl font-bold mt-6">Create a Listing</h1>
      <form className="">
        <p className="text-left mt-6 font-semibold text-lg">Sell/Rent</p>
        <div className="flex">
          <button
            id="type"
            value="sale"
            onClick={onChange}
            className={`w-full mr-3 shadow-md text-sm uppercase rounded hover:shadow-lg p-2 focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 font-medium ${
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
          >
            sell
          </button>
          <button
            id="type"
            value="rent"
            onClick={onChange}
            className={`w-full ml-3 shadow-md text-sm uppercase rounded hover:shadow-lg p-2 focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 font-medium ${
              type === "sale"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
          >
            rent
          </button>
        </div>
      </form>
    </main>
  );
}
