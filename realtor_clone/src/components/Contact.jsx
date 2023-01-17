import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

export default function Contact({ userRef, listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  function onChange(e) {
    setMessage(e.target.value);
  }

  useEffect(() => {
    async function fetchLandlord() {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could'nt get landlord's data");
      }
    }
    fetchLandlord();
  }, [userRef]);

  return (
    <>
      {landlord !== null && (
        <div className="flex flex-col">
          <p>
            Contact {landlord.name} for {listing.name.toLowerCase()}
          </p>
          <div className="mt-3">
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 border border-gray-300 bg-white rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            ></textarea>
            <a
              href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
            >
              <button
                className="px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full text-center mt-6"
                type="button"
              >
                Send message
              </button>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
