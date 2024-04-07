import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useRef } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import {
  userUpdateStart,
  userUpdateSuccess,
  userUpdateFailure,
  userDeleteStart,
  userDeleteSuccess,
  userDeleteFailure,
  userSignOutStart,
  userSignOutSuccess,
  userSignOutFailure
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

//end of imports

export default function Profile() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleDelete = async ()=>{
   try {
    dispatch(userDeleteStart())
    const res = await fetch(`/api/delete/${currentUser._id}`,
    {
      method:'DELETE',
    }
    )
    const data = await res.json()
    if(data.success === false){
      dispatch(userDeleteFailure(data.message))
      return
    }
    dispatch(userDeleteSuccess(data))

   } catch (error) {
    dispatch(userDeleteFailure(error.message))
   }
  }

  const handleSignOut = async ()=>{
    try {
      dispatch(userSignOutStart())
      const res = await fetch('/api/signout')
      const data = await res.json()
      if(data.success === false){
        dispatch(userSignOutFailure(data.message))
        return
      }
      dispatch(userSignOutSuccess(data))

    } catch (error) {
      dispatch(userSignOutFailure(error.message))
    }
    
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(userUpdateStart());
      const res = await fetch(`/api/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(userUpdateFailure(data.message));
        return;
      }
      dispatch(userUpdateSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(userUpdateFailure(error.message))
      
    }
  };

  return (
    <div className="main-profile">
      <div className="profile">
        <h1>YOUR PROFILE</h1>

        <div className="form">
          <form onSubmit={handleSubmit} className="inside-form">
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
            />

            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser.avatar}
              alt="profile"
            />
            <p>
              {fileUploadError ? (
                <span>Error uploading image</span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span>{`Uploading${filePerc}%`}</span>
              ) : filePerc === 100 ? (
                <span>Image uploaded successfully </span>
              ) : (
                ""
              )}
            </p>
            <input
              type="text"
              defaultValue={currentUser.username}
              onChange={handleChange}
              id="username"
            />
            <input
              type="email"
              defaultValue={currentUser.email}
              onChange={handleChange}
              id="email"
            />
            <input
              type="password"
              defaultValue={currentUser.password}
              onChange={handleChange}
              id="password"
            />
            <button>{loading? "Updating Profile":"Update"}</button>
          </form>
          <div className="signout-delete">
            <div className="delete"><p onClick={handleDelete}>Delete Account</p></div>
            <div className="out" ><p onClick={handleSignOut}>Signout</p></div>          
          </div>
          <Link to='/listing'>
          <button>Create Listing</button>
          </Link>
          <p>{error? error:""}</p>
          <p>{updateSuccess? "Profile updated successfuly":""}</p>
        </div>
      </div>
    </div>
  );
}
