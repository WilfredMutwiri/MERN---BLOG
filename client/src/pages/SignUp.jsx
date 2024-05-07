import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link,useNavigate} from 'react-router-dom'

export default function SignUp() {
  const [formdata,setFormData]=useState({});
  const [errorMessage,setErrorMessage]=useState(null);
  const [loading,setIsLoading]=useState(false);
  const Navigate=useNavigate();
  const handleChange=(e)=>{
    setFormData({...formdata,[e.target.id]:e.target.value.trim()})
  }
  const handleSubmit=async (e) =>{
    e.preventDefault();

    if(!formdata.userName || !formdata.email || !formdata.password){
      return setErrorMessage("Please fill out all the fields");
     }
    try {
      setErrorMessage(null)
      setIsLoading(true)
      const res=await fetch('/api/auth/signup',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formdata)
      })
      const data=await res.json()
      if(data.success==false){
        return setErrorMessage(data.message)
      }
      setIsLoading(false)
      if(res.ok){
        Navigate('/sign-in')
      }
    } catch (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
    }
  }
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
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <Label value='Your userName'/>
            <TextInput
            type='text'
            placeholder='UserName'
            id='userName'
            onChange={handleChange}
            />
          </div>
          <div>
            <Label value='Your Email'/>
            <TextInput
            type='email'
            placeholder='name@company.com'
            id='email'
            onChange={handleChange}
            />
          </div>
          <div>
            <Label value='Your Password'/>
            <TextInput
            type='password'
            placeholder='Password'
            id='password'
            onChange={handleChange}
            />       
          </div>
          <Button gradientDuoTone="purpleToPink" type='submit' disabled={loading}>
            {
              loading ? (
                <>
                <Spinner size='sm'/>
                <span className='pl-3'>Loading...</span>
                </>
              ): 'Sign Up'
            }
          </Button>
        </form>
        <div className="flex gap-2 text-sm mt-5">
          <span>Have an account?</span>
          <Link to="/sign-in" className='text-blue-500'>
            Sign In
          </Link>
        </div>
        <div>
          {
            errorMessage && (
              <Alert className='mt-5' color="failure">
              {errorMessage}
            </Alert>
          )
          }
        </div>
      </div>
      </div>
    </div>
  )
}
