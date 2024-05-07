import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='min-h-screen mt-20'>
      <div className="block md:flex md:items-center p-3 max-w-3xl mx-auto gap-5">
         {/* left div */}
      <div className="flex-1">
      <Link to="/" className='text-4xl font-bold'>
      <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Destinykers</span>Blog
      </Link>
      <p className='text-sm mt-5'> 
        This is the best blog site you can wish for. Sign up with your email and password
        or google to enjoy our services!
      </p>
      </div>
      {/* rigth div */}
      <div className="flex-1">
        <form className='flex flex-col gap-4'>
          <div>
            <Label value='Your userName'/>
            <TextInput
            type='text'
            placeholder='UserName'
            id='userName'/>
          </div>
          <div>
            <Label value='Your Email'/>
            <TextInput
            type='text'
            placeholder='name@company.com'
            id='email'/>
          </div>
          <div>
            <Label value='Your Password'/>
            <TextInput
            type='text'
            placeholder='Password'
            id='password'/>
          </div>
          <Button gradientDuoTone="purpleToPink" type='submit'>
            Sign Up
          </Button>
        </form>
        <div className="flex gap-2 text-sm mt-5">
          <span>Have an account?</span>
          <Link to="/sign-in" className='text-blue-500'>
            Sign In
          </Link>
        </div>
      </div>
      </div>
    </div>
  )
}
