import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Slider from "../components/Slider";
import { db } from "../firebase";

export default function Home() {
  // Offers
  const [offerListing, setOfferListing] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingRef = collection(db, "listings");
        // creating query
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // executing query
        const docSnap = await getDocs(q);
        const listings = [];

        docSnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListing(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  });
  // Places for Rent
  const [rentListing, setRentListing] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingRef = collection(db, "listings");
        // creating query
        const q = query(
          listingRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // executing query
        const docSnap = await getDocs(q);
        const listings = [];

        docSnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListing(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  });

  return (
    <div>
      <Slider />
      <div className="max-w-6xl mx-auto pt-4 space-y-6 text-left">
        {offerListing && offerListing.length > 1 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Recent Offers</h2>
            <Link to="/offers">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more offers
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              {offerListing.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
