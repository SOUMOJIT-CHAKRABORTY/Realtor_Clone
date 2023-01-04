import { getAuth, updateProfile } from 'firebase/auth';
import { doc,updateDoc } from 'firebase/firestore';
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router';
import {toast} from 'react-toastify';
import {db} from "../firebase"

export default function Profile() {

  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail , setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });

  const {name , email} = formData;

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  function onChange(e) {
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]:e.target.value,
    }))
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
      toast.success("Profile details updated")
    } catch (error) {
      toast.error("Could'nt update the changes")
      
    }
  }

  return (
    <section className='max-w-6xl m-auto flex justify-center items-center flex-col'>
      <h1 className='text-3xl font-bold mt-6'>My Profile</h1>
      <div className=' w-full md:w-[50%] mt-6 px-3'>
        <form>
          {/* Name */}
          <input onChange={onChange} type="text" id='name' value={name} disabled ={!changeDetail} className={`mb-6 w-full rounded py-2 px-4 text-gray-700 text-xl bg-white border border-gray-300 transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-red-200"}`} />

          {/* Email */}
          <input type="email" id='email' value={email} disabled ={!changeDetail} className="mb-6 w-full rounded py-2 px-4 text-gray-700 text-xl bg-white border border-gray-300 transition ease-in-out " />

      <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6'>
        <p className='text-left'>Do you want to change your name?
          <span onClick={()=>{
            changeDetail && onsubmit(); 
            setChangeDetail((prevState)=> !prevState);}} 
            className='ml-1 cursor-pointer text-red-500 hover:text-red-700 transition duration-200 ease-in-out'>{changeDetail ? "Apply Change" : "Edit"}</span>
        </p>
        <p onClick={onLogout} className='cursor-pointer text-blue-500 hover:text-blue-800 transition duration-150 ease-in-out'>Sign out</p>
      </div>
        </form> 
      </div>
    </section>
  )
}
