import React from 'react'
import { useState } from 'react'

export default function Profile() {

  const [formData, setFormData] = useState({
    name: "Soumojit",
    email: "test1@gmail.com"
  })

  const {name , email} = formData;

  return (
    <section className='max-w-6xl m-auto flex justify-center items-center flex-col'>
      <h1 className='text-3xl font-bold mt-6'>My Profile</h1>
      <div className=' w-full md:w-[50%] mt-6 px-3'>
        <form>
          <input type="text" id='name' value={name} className="mb-6 w-full rounded py-2 px-4 text-gray-700 text-xl bg-white border border-gray-300 transition ease-in-out " />
          <input type="email" id='email' value={email} className="mb-6 w-full rounded py-2 px-4 text-gray-700 text-xl bg-white border border-gray-300 transition ease-in-out " />

        </form> 
      </div>
    </section>
  )
}
