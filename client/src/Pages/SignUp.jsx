import React, { useState } from "react";
import signup from "../assets/signUp.png";
import "../Pages/SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        "/api/signup",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);

      navigate("/signin");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="main-signup">
      <div className="signup">
        <h1>Sign Up</h1>
        <div className="signup-form">
          <div className="signup-left">
            <img src={signup} alt="" />
          </div>
          <div className="signup-right">
            <form className="sign-form" onSubmit={handleSubmit}>
              <div className="inputs-btns">
                <input
                  type="text"
                  placeholder="Username"
                  id="username"
                  required
                  onChange={handleChange}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  id="email"
                  required
                  onChange={handleChange}
                />
                <input
                  type="password"
                  placeholder="Enter password here"
                  id="password"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="with-auth">
              <button>{loading ? "Signing you up..." : "Sign up"}</button>
              <OAuth/>
            </div>
            </form>
            <p>Have an account?<Link to='/signin'><span>Signin</span></Link></p>
            {error && <p>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
