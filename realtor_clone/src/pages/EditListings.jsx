import React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect } from "react";

export default function EditListing() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listing, setlisting] = useState(null);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  const params = useParams();

  useEffect(() => {
    setLoading(true);
    async function fetchFormData() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setlisting(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exists");
      }
    }

    fetchFormData();
  }, [navigate, params.listingId]);

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You can't edit this listing");
      navigate("/");
    }
  }, [auth.currentUser.uid, navigate, listing]);

  let geolocation = {};
  let location;
  function onChange(e) {
    let boolean = null;
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.value === "true") {
      boolean = true;
    }
    // For Files

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // For Text / Booleans / Numbers

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price should be less than Regular price");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 images are allowed");
      return;
    }

    if (!geolocationEnabled) {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject();
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Could'nt upload image");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    !formData.offer && delete formDataCopy.discountedPrice;
    const docRef = await updateDoc(
      doc(db, "listings", params.listingId),
      formDataCopy
    );
    setLoading(false);
    toast.success(" Edited  Listing ");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="mx-auto px-2 max-w-md">
      <h1 className="text-3xl font-bold mt-6">Create a Listing</h1>
      <form onSubmit={onSubmit} className="">
        <p className="text-left mt-6 font-semibold text-lg">Sell/Rent</p>
        <div className="flex mb-6">
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
        <section className="text-left mb-6">
          <p className="mt-6 font-semibold text-lg">Name</p>
          <input
            type="text"
            id="name"
            placeholder="Name"
            maxLength="32"
            minLength="10"
            required
            value={name}
            onChange={onChange}
            className="w-full text-xl border border-gray-300 bg-white rounded text:sm text-gray-700 focus:bg-white focus:text-gray-700 focus:border-slate-600"
          ></input>
        </section>
        <div className="flex mb-6 space-x-6">
          <div className="text-left">
            <p className="font-semibold text-lg">Beds</p>
            <section className="">
              <input
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onChange}
                min="1"
                max="50"
                required
                className="w-full text-gray-700 border border-gray-300 text-xl rounded focus:bg-white px-4 py-2 bg-white focus:border-slate-600 text-center"
              ></input>
            </section>
          </div>
          <div className="text-left">
            <p className="font-semibold text-lg">Baths</p>
            <section className="">
              <input
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={onChange}
                min="1"
                max="50"
                required
                className="w-full text-gray-700 border border-gray-300 text-xl rounded focus:bg-white px-4 py-2 bg-white focus:border-slate-600 text-center"
              ></input>
            </section>
          </div>
        </div>
        <p className="text-left mt-6 font-semibold text-lg">Parking Spot</p>
        <div className="flex mb-6">
          <button
            id="parking"
            value={true}
            onClick={onChange}
            className={`w-full mr-3 shadow-md text-sm uppercase rounded hover:shadow-lg p-2 focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 font-medium ${
              !parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            yes
          </button>
          <button
            id="parking"
            value={false}
            onClick={onChange}
            className={`w-full ml-3 shadow-md text-sm uppercase rounded hover:shadow-lg p-2 focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 font-medium ${
              parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            no
          </button>
        </div>
        <p className="text-left mt-6 font-semibold text-lg">Furnished</p>
        <div className="flex mb-6">
          <button
            id="furnished"
            value={true}
            onClick={onChange}
            className={`w-full mr-3 shadow-md text-sm uppercase rounded hover:shadow-lg p-2 focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 font-medium ${
              !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            yes
          </button>
          <button
            id="furnished"
            value={false}
            onClick={onChange}
            className={`w-full ml-3 shadow-md text-sm uppercase rounded hover:shadow-lg p-2 focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 font-medium ${
              furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            no
          </button>
        </div>
        <section className="text-left mb-6">
          <p className="mt-6 font-semibold text-lg">Address</p>
          <textarea
            type="text"
            id="address"
            placeholder="Address"
            required
            value={address}
            onChange={onChange}
            className="w-full text-xl border border-gray-300 bg-white rounded text:sm text-gray-700 focus:bg-white focus:text-gray-700 focus:border-slate-600"
          ></textarea>
        </section>
        <div className="text-left mb-6 flex space-x-6">
          <div>
            <p className="text-lg font-semibold">Latitude</p>
            <input
              type="number"
              id="latitude"
              value={latitude}
              onChange={onChange}
              required
              min="-90"
              max="90"
              className="w-full text-gray-700 border border-gray-300 text-xl rounded focus:bg-white px-4 py-2 bg-white focus:border-slate-600 text-center"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Longitude</p>
            <input
              type="number"
              id="longitude"
              value={longitude}
              onChange={onChange}
              required
              min="-180"
              max="180"
              className="w-full text-gray-700 border border-gray-300 text-xl rounded focus:bg-white px-4 py-2 bg-white focus:border-slate-600 text-center"
            />
          </div>
        </div>
        <section className="text-left mb-6">
          <p className="font-semibold text-lg">Description</p>
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            required
            value={description}
            onChange={onChange}
            className="w-full text-xl border border-gray-300 bg-white rounded text:sm text-gray-700 focus:bg-white focus:text-gray-700 focus:border-slate-600"
          ></textarea>
        </section>
        <p className="text-left  font-semibold text-lg">Offers</p>
        <div className="flex mb-6">
          <button
            id="offer"
            value={true}
            onClick={onChange}
            className={`w-full mr-3 shadow-md text-sm uppercase rounded hover:shadow-lg p-2 focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 font-medium ${
              !offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            yes
          </button>
          <button
            id="offer"
            value={false}
            onClick={onChange}
            className={`w-full ml-3 shadow-md text-sm uppercase rounded hover:shadow-lg p-2 focus:shadow-lg active:shadow-lg transition ease-in-out duration-200 font-medium ${
              offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            no
          </button>
        </div>
        <div className="text-left mb-6">
          <p className="font-semibold text-lg">Regular Price</p>
          <div className="flex items-center space-x-6">
            <div className="">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="10"
                max="50000000"
                required
                className="w-full text-gray-700 border border-gray-300 text-xl rounded focus:bg-white px-4 py-2 bg-white focus:border-slate-600 text-center"
              ></input>
            </div>
            {type === "rent" && (
              <div>
                <p className="whitespace-nowrap text-md w-full">$ / Month</p>
              </div>
            )}
          </div>
        </div>
        {offer && (
          <div className="text-left mb-6">
            <p className="font-semibold text-lg">Discounted Price</p>
            <div className="flex items-center space-x-6">
              <div className="">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="10"
                  max="50000000"
                  required={offer}
                  className="w-full text-gray-700 border border-gray-300 text-xl rounded focus:bg-white px-4 py-2 bg-white focus:border-slate-600 text-center"
                ></input>
              </div>
            </div>
          </div>
        )}
        <div className="text-left mb-6">
          <p className="font-semibold text-xl">Images</p>
          <p className="text-gray-600">
            The first image will be the cover (max 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg , .png, .jpeg"
            multiple
            required
            className="w-full bg-white px-3 py-1.5 text-gray-700 border-gray-300-rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
          ></input>
        </div>
        <button
          type="submit"
          className="mb-6 w-full bg-blue-600 text-white font-medium text-sm rounded shadow-md hover:bg-blue-700 hover:shadow-lg px-7 py-3 uppercase focus:bg-blue-700 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          {" "}
          Edit Listing
        </button>
      </form>
    </main>
  );
}
