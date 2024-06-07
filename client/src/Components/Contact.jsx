import React, { useEffect, useState } from "react";
import "./Contact.css";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landLord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  console.log(message);

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandLord(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchLandLord();
  }, [listing.userRef]);

  return (
    <>
      <p>
        {landLord && (
          <div className="contact">
            <p>
              Contact <span> {landLord.username}</span>
              for <span>{listing.name}</span>
            </p>
            <textarea
              name="message"
              id="message"
              rows="5"
              value={message}
              onChange={handleChange}
            ></textarea>
            <Link
              to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`} className="link"
            >
              Send Message
            </Link>
          </div>
        )}
      </p>
    </>
  );
}
