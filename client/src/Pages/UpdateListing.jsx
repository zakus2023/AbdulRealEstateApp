import React, { useEffect, useState } from "react";
import "./UpdateListing.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function CreateListing() {
  const [files, setFile] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadingError, setImageUploadingError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    description: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
  });

  console.log(formData);

  useEffect(() => {
    const fetchlisting = async () => {
      const listingid = params.listingId;
      const res = await fetch(`/api/get/${listingid}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchlisting();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadingError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadingError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadingError("You can only upload 6 images per listing");
          setUploading(false);
        });
    } else {
      setImageUploadingError("You can not upload more than 6 images");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteItem = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "rent" || e.target.id === "sale") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be less than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/updateListing/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }

      navigate(`/listingpage/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="main">
      <h1>Create Listing</h1>
      <form onSubmit={handleSubmitForm}>
        <div className="listing-left">
          <div className="first-input">
            <input
              type="text"
              placeholder="Listing Title"
              minLength="10"
              maxLength="62"
              required
              value={formData.name}
              onChange={handleChange}
              id="name"
            />
            <input
              type="text"
              placeholder="Street number and apartmet (if applicable)"
              required
              value={formData.address}
              onChange={handleChange}
              id="address"
            />
            <input
              type="text"
              placeholder="City"
              required
              value={formData.city}
              onChange={handleChange}
              id="city"
            />
            <input
              type="text"
              placeholder="Province"
              required
              value={formData.province}
              onChange={handleChange}
              id="province"
            />
            <input
              type="text"
              placeholder="Zip code/Postal code"
              required
              value={formData.postalCode}
              onChange={handleChange}
              id="postalCode"
            />
            <textarea
              name="text"
              rows="5"
              placeholder="Describe your listing"
              required
              value={formData.description}
              onChange={handleChange}
              id="description"
            ></textarea>
          </div>
          <div className="second-input">
            <div className="che">
              <label>Sell</label>
              <input
                type="checkbox"
                checked={formData.type === "sale"}
                onChange={handleChange}
                id="sale"
              />
            </div>
            <div className="che">
              <label>Rent</label>
              <input
                type="checkbox"
                checked={formData.type === "rent"}
                onChange={handleChange}
                id="rent"
              />
            </div>
            <div className="che">
              <label>Parking spot</label>
              <input
                type="checkbox"
                onChange={handleChange}
                value={formData.parking}
                id="parking"
              />
            </div>
            <div className="che">
              <label>Furnished</label>
              <input
                type="checkbox"
                onChange={handleChange}
                value={formData.furnished}
                id="furnished"
              />
            </div>
            <div className="che">
              <label>Offer</label>
              <input
                type="checkbox"
                onChange={handleChange}
                value={formData.offer}
                id="offer"
              />
            </div>
          </div>
          <div className="third-input">
            <div className="nums">
              <input
                type="number"
                onChange={handleChange}
                required
                value={formData.bedrooms}
                min="1"
                max="15"
                id="bedrooms"
              />
              <label>Bedrooms</label>
            </div>
            <div className="nums">
              <input
                type="number"
                onChange={handleChange}
                required
                value={formData.bathrooms}
                min="1"
                max="15"
                id="bathrooms"
              />
              <label>Bathrooms</label>
            </div>
          </div>
          <div className="forth-input">
            <div className="nums">
              <input
                type="number"
                onChange={handleChange}
                required
                min="50"
                max="10000000"
                value={formData.regularPrice}
                id="regularPrice"
              />
              <label>Regular Price</label>
              {formData.type === "sale" ? "($)" : <p>($/month)</p>}
            </div>
            {formData.offer && (
              <div className="nums">
                <input
                  type="number"
                  onChange={handleChange}
                  required
                  min="0"
                  max="10000000"
                  value={formData.discountPrice}
                  id="discountPrice"
                />
                <label>Discounted Price </label>

                {formData.type === "sale" ? "($)" : <p>($/month)</p>}
              </div>
            )}
          </div>
        </div>
        <div className="listing-right">
          <p>
            <span>Images: </span>The first image will be the cover (Max. of 6
            images)
          </p>
          <div className="whole-image-part">
            <div className="choose-file">
              <div>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files)}
                  multiple
                />
              </div>
              <div>
                <button type="button" onClick={handleImageSubmit}>
                  {uploading ? "Uploading..." : "Upload"}
                </button>
                <p>{imageUploadingError && imageUploadingError}</p>
              </div>
            </div>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div key={url} className="listing-img">
                  <img src={url} alt="" />
                  <button
                    onClick={() => {
                      handleDeleteItem(index);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>

          <button>
            {loading ? "Creating your listing" : "Create Listing"}
          </button>
        </div>
      </form>
      <p>{error ? error : "Listing created successfully"}</p>
    </main>
  );
}
