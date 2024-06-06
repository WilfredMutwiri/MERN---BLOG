import { Alert, Button, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import {getDownloadURL, getStorage, uploadBytesResumable,ref} from 'firebase/storage'
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart,updateSuccess,updateFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { SERVER_URL } from '../constants/ServerURL';
export default function Dashboard()
{
    const {currentUser}=useSelector(state=>state.user);
    const [imageFile,setImageFile]=useState(null);
    const [imageFileUrl,setImageFileUrl]=useState(null);
    const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null);
    const [imageFileUploadError,setImageFileUploadError]=useState(null);
    const [imageFileUploading,setImageFileUploading]=useState(false);
    const [updateUserSuccess,setUpdateUserSuccess]=useState(null);
    const [updateUserError,setUpdateUserError]=useState(null)
    const [formData,setFormData]=useState({})
    const dispatch=useDispatch();

    const filePickerRef=useRef();
    const handleImageChange=(e)=>{
        const file=e.target.files[0];
        if(file){
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }
    useEffect(()=>{
        if(imageFile){
            const uploadImage=async()=>{
                setImageFileUploading(true)
                setImageFileUploadError(null)
                const storage=getStorage(app)
                const fileName= new Date().getTime()+imageFile.name;
                const storageRef=ref(storage,fileName)
                const uploadTasks=uploadBytesResumable(storageRef,imageFile)
                uploadTasks.on(
                    'state_changed',
                    (snapshot)=>{
                        const progress=snapshot.bytesTransferred/snapshot.totalBytes*100
                        setImageFileUploadProgress(progress.toFixed(0))
                    },
                    (error)=>{
                        setImageFileUploadError("Could not upload image (File must be less than 2 MB)");
                        setImageFileUploadProgress(null);
                        setImageFile(null);
                        setImageFileUrl(null)
                        setImageFileUploading(false)
                    },
                    ()=>{
                        getDownloadURL(uploadTasks.snapshot.ref).then((downloadURL)=>{
                        setImageFileUrl(downloadURL);
                        setImageFile(null);
                        setFormData((prevData)=>({...prevData,profilePicture:downloadURL}));
                        setImageFileUploading(false)
                    });
            }
        );
    };
    uploadImage()
}
},[imageFile])
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if(Object.keys(formData).length===0){
            setUpdateUserError("No changes made!")
            return;
        }
        if(imageFileUploading){
            setUpdateUserError("Please wait for the image to upload")
            return;
        }
        try {
            dispatch(updateStart());
            const res=await fetch(SERVER_URL+`/api/user/update/${currentUser._id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            }
            )
            const data=await res.json();
            if(!res.ok){
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message)
            }else{
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("User Profile Updated Successfully")
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(data.message)
        }
    };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='text-center font-semibold text-3xl my-7'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
            <div className='relative w-32 h-32 cursor-pointer self-center shadow-md overflow-hidden rounded-full' onClick={()=>filePickerRef.current.click()}>
            {imageFileUploadProgress && (
                <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                    root:{
                        width:'100%',
                        height:'100%',
                        position:'absolute',
                        top:0,
                        left:0
                    },
                    path:{
                        stroke:`rgba(62,152,199,${imageFileUploadProgress/100})`
                    }
                }}
                />
            )}
                <img src={ imageFileUrl || currentUser.profilePicture} alt='user' className={`rounded-full w-full h-full object-cover border-8 border-gray-200 ${imageFileUploadProgress && imageFileUploadProgress <100 && 'opacity-60'}`}/>
            </div>
            {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
            <TextInput 
            type='text' 
            placeholder='userName' 
            defaultValue={currentUser.userName} 
            id='userName'
            onChange={handleChange}
            />

            <TextInput 
            type='email' 
            placeholder='email' 
            defaultValue={currentUser.email} 
            id='email'
            onChange={handleChange}
            />

            <TextInput 
            type='password' 
            placeholder='*******' 
            id='password'
            onChange={handleChange}
            />

            <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                Update
            </Button>
        </form>
        <div className='flex justify-between mt-5 text-red-500'>
            <span className='cursor-pointer'>Delete Account</span>
            <span className='cursor-pointer'>Sign Out</span>
        </div>
        {updateUserSuccess && 
        <Alert color="success" className='mt-5 mb-4'>
            {updateUserSuccess}
        </Alert>
        }
        {updateUserError && 
        <Alert color="failure" className='mt-5 mb-4'>
            {updateUserError}
        </Alert>
        }
    </div>
  )
}
