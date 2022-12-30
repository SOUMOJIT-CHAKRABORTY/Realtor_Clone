import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import {doc,getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import React from 'react'
import{FcGoogle} from 'react-icons/fc'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { db } from '../firebase'
export default function OAuth() {

  const navigate = useNavigate();

  async function onGoogleClick() {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const results = await signInWithPopup(auth, provider)
      const user = results.user
      console.log(user)

      // Checking for the user if he already exist

      const docRef = doc(db, "users" , user.uid);

      const docSnap = await getDoc(docRef);

      if(!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp()
        });
      }
      navigate("/")
      
    } catch (error) {
      toast.error("Could not complete sign up with Google")
      console.log(error)
    }
  }
  return (
    <button type='button' onClick={onGoogleClick} className='flex justify-center items-center w-full bg-red-700 text-white px-7 py-3 text-sm font-medium uppercase shadow-md rounded hover:bg-red-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-red-900 '>
        <FcGoogle className='text-2xl bg-white rounded-full mr-2'/>Continue with Google
    </button>
  )
}
