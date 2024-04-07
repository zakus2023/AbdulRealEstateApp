import React, { useState } from "react";
import login from "../assets/log.png";
import "./SignIn.css";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth";

export default function SignIn() {
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="sign-top">
      <h1>Sign In</h1>
      <div className="main-signin">
        
        
          <form onSubmit={handleSubmit} className="form">
            <div className="">
              <input
                type="text"
                placeholder="email"
                id="email"
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="password"
                id="password"
                onChange={handleChange}
              />
              
              <button>{loading ? "Signing you in..." : "Signin"}</button>
              <OAuth/>
            
            </div>
            
          </form>
          <p>Do not have an account? <Link to='/signup'><span>Signup</span></Link></p>
          {error && <p className="error-para">{error}</p>}
        
      </div>
    </div>
  );
}
