import React, { useEffect, useState } from "react";
import "./Listing.css";
import { useParams } from "react-router-dom";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaParking,
  FaMapMarkerAlt,
  FaShare,
} from "react-icons/fa";

// import house2 from "../assets/house2.jpg";
// import house3 from "../assets/house3.jpg";
// import house4 from "../assets/house4.jpg";
// import house5 from "../assets/house5.jpg";
// import house6 from "../assets/house6.webp";
// import house7 from "../assets/house7.jpg";

import { useSelector } from "react-redux";
import Contact from "../Components/Contact";

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  console.log(listing);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        setListing(data);
        setSelectedImage(data.imageUrls);
        setError(false);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (index) => {
    setSelectedImage(listing.imageUrls[index]);
  };

  //   console.log(selectedImage);
  return (
    <div className="main">
      {loading && <p>Loading ...</p>}
      {error && <p>Something went wrong</p>}
      {listing && !loading && !error && (
        <div className="listing-info">
          <h1>{listing.name}</h1>
          <div className="row">
            <div className="left-col">
              <div className="main-img">
                <img src={selectedImage} alt="" />
              </div>
              <div className="small-img">
                {listing.imageUrls.map((listings, index) => (
                  <div className="sm-img" key={index}>
                    <img
                      src={listings}
                      alt=""
                      className="smalling"
                      onClick={() => handleImageClick(index)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="right-col">
              <div className="listing-name">
                <p className="para-name">
                  {listing.name} - $ {""}
                  {listing.offer
                    ? listing.discountPrice.toLocaleString("en-US")
                    : listing.regularPrice.toLocaleString("en-US")}
                  {listing.type === "rent" && "/month"}
                </p>
                <div className="type-disc">
                  <p className="para-name">
                    {listing.type === "rent" ? "For rent" : "For Sale"}
                  </p>

                  {listing.offer && (
                    <p className="para-name">
                      ${+listing.regularPrice - +listing.discountPrice} OFF
                    </p>
                  )}
                </div>
              </div>
              <div className="listing-type">
                <FaMapMarkerAlt className="fa" />
                <p>
                  {listing.address} {listing.city} {listing.province}{" "}
                  {listing.postalCode}
                </p>
              </div>
              <div className="description">
                <h2>Description</h2>
                <p>{listing.description}</p>
                <div className="facilities">
                  <h2>Facilties</h2>
                 <div className="facil">
                 <div className="bed">
                    {listing.bedrooms && (
                      <p>
                        <FaBed className="fa" />
                        <span>{listing.bedrooms}</span>Beds
                      </p>
                    )}
                  </div>
                  <div className="bed">
                    {listing.bathrooms && (
                      <p>
                        <FaBath className="fa" />
                        <span>{listing.bathrooms}</span>Baths
                      </p>
                    )}
                  </div>
                  <div className="bed">
                    {listing.parking && (
                      <p>
                        <FaParking className="fa" />
                        <span>Parking Spot</span>
                      </p>
                    )}
                  </div>
                  <div className="bed">
                    {listing.furnished && (
                      <p>
                        <FaChair className="fa" />
                        <span>Furnished</span>
                      </p>
                    )}
                  </div>
                 </div>
                </div>
              </div>
              {currentUser &&
                listing.userRef !== currentUser._id &&
                !contact && (
                  <button onClick={() => setContact(true)}>
                    Contact Landlord
                  </button>
                )}
              {contact && <Contact listing={listing} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
