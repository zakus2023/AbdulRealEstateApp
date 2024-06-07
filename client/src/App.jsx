import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import About from "./Pages/About";
import SignUp from "./Pages/SignUp";
import Profile from "./Pages/Profile";
import SignIn from "./Pages/SignIn";
import CreateListing from './Pages/CreateListing'
import PrivateRoutes from "./Components/PrivateRoutes";
import UpdateListing from "./Pages/UpdateListing";
import Listing from "./Pages/Listing";
import Search from "./Pages/Search";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/listingpage/:listingId" element={<Listing/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route element={<PrivateRoutes/>}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/listing" element={<CreateListing/>}/>
        <Route path="/edit-listing/:listingId" element={<UpdateListing/>}/>
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
