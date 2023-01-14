import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing, id }) {
  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
          src={listing.imgUrls[0]}
          loading="lazy"
          alt="/"
        />
        <Moment
          className="bg-[#3377cc] text-white px-2 absolute top-2 left-2 rounded-md uppercase font-semibold text-xs shadow-lg py-1"
          fromNow
        >
          {listing.timestamp?.toDate()}
        </Moment>
        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-sm text-gray-600 truncate mb-[2px]">
              {listing.address}
            </p>
          </div>
          <p className="font-semibold text-lg m-0 truncate">{listing.name}</p>
          <p className="text-[#457b9d] mt-2 font-semibold">
            ${listing.offer ? listing.discountedPrice : listing.regularPrice}
            {listing.type == "rent" && " / month"}
          </p>

          <div className="flex space-x-3 mt-[10px] items-center">
            <div className="flex space-x-1 items-center">
              <p className="font-bold text-xs">
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
              </p>
            </div>
            <div className="flex space-x-1 items-center">
              <p className="font-bold text-xs">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : "1 Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
