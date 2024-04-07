import React, { useState } from "react";
import "./CreateListing.css";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function Listing() {
  const [files, setFile] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadingError, setImageUploadingError] = useState(false);

  const [formData, setFormData] = useState({
    imageUrls: [],
  });

  console.log(formData)
 

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
    }else{
      setImageUploadingError('You can not upload more than 6 images')
      setUploading(false)
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

  return (
    <main className="main">
      <h1>Create Listing</h1>
      <form>
        <div className="listing-left">
          <div className="first-input">
            <input type="text" placeholder="Listing Title" />
            <input
              type="text"
              placeholder="Street number and apartmet (if applicable)"
            />
            <input type="text" placeholder="City" />
            <input type="text" placeholder="Province" />
            <input type="text" placeholder="Zip code/Postal code" />
            <textarea
              name="text"
              rows="5"
              placeholder="Describe your listing"
            ></textarea>
          </div>
          <div className="second-input">
            <div className="che">
              <label>Sell</label>
              <input type="checkbox" />
            </div>
            <div className="che">
              <label>Rent</label>
              <input type="checkbox" />
            </div>
            <div className="che">
              <label>Parking spot</label>
              <input type="checkbox" />
            </div>
            <div className="che">
              <label>Furnished</label>
              <input type="checkbox" />
            </div>
            <div className="che">
              <label>Offer</label>
              <input type="checkbox" />
            </div>
          </div>
          <div className="third-input">
            <div className="nums">
              <input type="number" />
              <label>Bedrooms</label>
            </div>
            <div className="nums">
              <input type="number" />
              <label>Bathrooms</label>
            </div>
          </div>
          <div className="forth-input">
            <div className="nums">
              <input type="number" />
              <label>Regular Price</label>
              <p>($/month)</p>
            </div>
            <div className="nums">
              <input type="number" />
              <label>Discounted Price </label>
              <p>($/month)</p>
            </div>
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
                <input type="file" onChange={(e) => setFile(e.target.files)} multiple/>
              </div>
              <div>
                <button type="button" onClick={handleImageSubmit}>
                  Upload
                </button>
              </div>
            </div>
          </div>
          <button>CREATE LISTING</button>
        </div>
      </form>
    </main>
  );
}