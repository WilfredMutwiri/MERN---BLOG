import { Alert, Button, Modal, ModalHeader, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import {getDownloadURL, getStorage, uploadBytesResumable,ref} from 'firebase/storage'
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { 
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { SERVER_URL } from '../constants/ServerURL';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
// import { verifyToken } from '../../../api/utils/verifyUser';

export default function Dashboard()
{
    const {currentUser,error}=useSelector(state=>state.user);
    const [imageFile,setImageFile]=useState(null);
    const [imageFileUrl,setImageFileUrl]=useState(null);
    const [imageFileUploadProgress,setImageFileUploadProgress]=useState(null);
    const [imageFileUploadError,setImageFileUploadError]=useState(null);
    const [imageFileUploading,setImageFileUploading]=useState(false);
    const [updateUserSuccess,setUpdateUserSuccess]=useState(null);
    const [updateUserError,setUpdateUserError]=useState(null)
    const [formData,setFormData]=useState({});
    const [showModal,setShowModal]=useState(false)
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
            const token = sessionStorage.getItem('token'); //Add this line
            const res=await fetch(SERVER_URL+`/api/user/update/${currentUser._id}`,{
                method:'PUT',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                    Authorization: `Bearer ${token}` //Add this line
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
            setUpdateUserError(error.message)
        }
    };
    const handleDeleteUser=async(req,res,next)=>{
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            console.log("delete initiated");
            const token = sessionStorage.getItem('token'); //Add this line
            const res=await fetch(SERVER_URL+`/api/user/delete/${currentUser._id}`,{
                method:'DELETE',
                Authorization: `Bearer ${token}` //Add this line

            });
            const data=await res.json();
            if(!res.ok){
                console.log("delete error");
                dispatch(deleteUserFailure(data.message))
            }else{
                dispatch(deleteUserSuccess(data))
            }

        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    };

    const handleSignout=async()=>{
        try {
            const res=await fetch('/api/user/signout',{
                method:"POST"
            })
            const data=await res.json()
            if(!res.ok){
                console.log(data.message);
            }else{
                dispatch(signoutSuccess())
            }
        } catch (error) {
            console.log(error.message);
        }
    }

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
            <span className='cursor-pointer'onClick={()=>setShowModal(true)}>Delete Account</span>
            <span className='cursor-pointer' onClick={handleSignout}>Sign Out</span>
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
        {error && 
        <Alert color="failure" className='mt-5 mb-4'>
            {error}
        </Alert>
        }
        <Modal show={showModal} onClose={()=>setShowModal(false)} popup size="md">
        <Modal.Header/>
        <Modal.Body>
        <div className='text-center'>
        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
        <div className='flex justify-center gap-4'>
            <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm Sure
            </Button>
            <Button color="gray" onClick={()=>setShowModal(false)}>
                No,Cancel
            </Button>
        </div>
        </div>
        </Modal.Body>
        </Modal>
    </div>
  )
}
