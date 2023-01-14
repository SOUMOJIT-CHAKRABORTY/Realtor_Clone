import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { FcHome } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import ListingItem from "../components/ListingItem";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onsubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        //update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update name in firestore

        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile details updated");
    } catch (error) {
      toast.error("Could'nt update the changes");
    }
  }
  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const quarySnap = await getDocs(q);
      let listings = [];
      quarySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  return (
    <>
      <section className="max-w-6xl m-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl font-bold mt-6">My Profile</h1>
        <div className=" w-full md:w-[50%] mt-6 px-3">
          <form>
            {/* Name */}
            <input
              onChange={onChange}
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              className={`mb-6 w-full rounded py-2 px-4 text-gray-700 text-xl bg-white border border-gray-300 transition ease-in-out ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
            />

            {/* Email */}
            <input
              type="email"
              id="email"
              value={email}
              disabled={!changeDetail}
              className="mb-6 w-full rounded py-2 px-4 text-gray-700 text-xl bg-white border border-gray-300 transition ease-in-out "
            />

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
              <p className="text-left">
                Do you want to change your name?
                <span
                  onClick={() => {
                    changeDetail && onsubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="ml-1 cursor-pointer text-red-500 hover:text-red-700 transition duration-200 ease-in-out"
                >
                  {changeDetail ? "Apply Change" : "Edit"}
                </span>
              </p>
              <p
                onClick={onLogout}
                className="cursor-pointer text-blue-500 hover:text-blue-800 transition duration-150 ease-in-out"
              >
                Sign out
              </p>
            </div>
          </form>
          <button className="bg-blue-500 w-full text-white font-medium uppercase px-7 py-3 rounded hover:bg-blue-700 transition ease-in-out duration-200 active:bg-blue-800 shodow-md text-sm hover:shadow-lg">
            <Link
              to="/create-listings"
              className="flex justify-center items-center"
            >
              <FcHome className="mr-2 text-3xl bg-red-200 rounded-full border-2 p-1" />
              Sell or Rent your Home.
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl mt-6 px-3 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-6"> My Listings </h2>
            <ul className="text-left sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
