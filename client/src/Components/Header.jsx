import React from "react";
import logo from "../assets/logo.png";
import { FaSearch } from "react-icons/fa";
import "./Header.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="header">
      <div className="navigator">
        <div className="left-navigator">
          <img src={logo} alt="logo" className="logo" />
          <form className="header-form">
            <input type="text" placeholder="Search . . ." />
            <FaSearch className="fa" />
          </form>
        </div>
        <div className="right-navigator">
          <ul>
            <Link to="/" className="link">
              <li>Home</li>
            </Link>
            <Link to="/about" className="link">
              <li>About</li>
            </Link>
            <Link to="/contact" className="link">
              <li>Contact us</li>
            </Link>
            <Link to="/blog" className="link">
              <li>Blog</li>
            </Link>
            {currentUser ? (
              <span className="uname">User:<span className="logged">{currentUser.username}</span> </span>
            ) : (
              ""
            )}
            <Link to="/profile" className="profile-pic link">
              {currentUser ? (
                <img
                  src={currentUser.avatar}
                  alt="pic"
                  className="upic"
                />
              ) : (
                <li>Signin</li>
              )}
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
