import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import Contact from "../components/Contact";

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  const auth = getAuth();

  const params = useParams();

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full flex justify-center items-center h-12 w-12"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 1500);
        }}
      >
        <FaShare className="text-slate-500 text-lg" />
      </div>
      {shareLinkCopied && (
        <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 bg-white rounded-md z-20">
          Link Copied
        </p>
      )}

      <div className="flex flex-col md:flex-row bg-white max-w-6xl lg:mx-auto p-4 rounded-lg lg:space-x-5 text-left shadow-md mt-6">
        <div className="w-full">
          <p className="text-2xl font-bold mb-5 text-blue-900">
            {listing.name} - ${" "}
            {listing.offer
              ? `${listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
              : `${listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
            {listing.type === "rent" ? "/ month" : ""}
          </p>
          <p className="flex items-center mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-800 mr-1" />
            {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-red-800 font-semibold w-full max-w-[200px] rounded-md text-center text-white shadow-md p-1">
              {listing.type === "rent" ? "rent" : "sale"}
            </p>
            <p className="bg-green-800 w-full max-w-[200px] text-center rounded-md font-semibold text-white p-1 shadow-md">
              $
              {listing.offer &&
                +listing.regularPrice - +listing.discountedPrice}{" "}
              discount
            </p>
          </div>
          <p className="my-3">
            <span className="font-semibold">Description - </span>
            {listing.description}
          </p>
          <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center">
              <FaBath className=" mr-1" />
              {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center">
              <FaParking className=" mr-1" />
              {!listing.parking ? `No Parking` : "Parking Spot"}
            </li>
            <li className="flex items-center">
              <FaChair className=" mr-1" />
              {listing.furnished ? `Furnished` : "Not Furnished"}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div className="mt-4">
              <button
                onClick={() => setContactLandlord(true)}
                className="py-3 px-2 bg-blue-600 hover:bg-blue-700 text-white font-medium uppercase text-sm shadow-md focus:bg-blue-700 cursor-pointer hover:shadow-lg focus:shadow-lg w-full text-center transition duration-150 ease-in-out"
              >
                Contact Landlord
              </button>
            </div>
          )}
          {contactLandlord && (
            <Contact userRef={listing.userRef} listing={listing} />
          )}
        </div>
        <div className="bg-blue-400 w-full h-[200px]"></div>
      </div>
    </main>
  );
}
