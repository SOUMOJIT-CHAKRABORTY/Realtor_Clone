// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhuGfLPDgP4XS84mZ4Q2qTF6JOzMn4p_8",
  authDomain: "realtor-react-cdf93.firebaseapp.com",
  projectId: "realtor-react-cdf93",
  storageBucket: "realtor-react-cdf93.appspot.com",
  messagingSenderId: "330447506472",
  appId: "1:330447506472:web:179d67ca1b4b2d6fc2f91d"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();