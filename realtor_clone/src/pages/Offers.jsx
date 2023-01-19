import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

export default function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchLastListing, setFetchLastListing] = useState(null);

  useEffect(() => {
    async function fetchListing() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("offers", "==", true),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const docSnap = await getDocs(q);
        let lastVisible = docSnap.docs[docSnap.length - 1];
        setFetchLastListing(lastVisible);
        let listings = [];
        docSnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could'nt fetch data of Offers");
      }
    }
    fetchListing();
  }, []);

  async function onFetchMoreListings() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("offers", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(fetchLastListing),
        limit(4)
      );
      const docSnap = await getDocs(q);
      let lastVisible = docSnap.docs[docSnap.length - 1];
      setFetchLastListing(lastVisible);
      let listings = [];
      docSnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could'nt fetch data of Offers");
    }
  }
  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl mt-6 font-bold mb-6">Offers</h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 1 ? (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </main>
          {fetchLastListing && (
            <div className="flex justify-center items-center">
              <button
                onClick={onFetchMoreListings}
                className="bg-white px-3 py-1.5 text-gray-700 border-gray-300 mb-6 mt-6 hover:border-slate-600 transition duration-150 ease-in-out rounded"
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p> No current offers</p>
      )}
    </div>
  );
}
