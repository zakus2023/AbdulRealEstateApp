import React from 'react'
import './ListingItem.css'
import { Link } from 'react-router-dom'

export default function ListingItem({listings}) {
  return (
    <div>
      <Link to={`/listingpage/${listings._id}`}>
        <p>{listings.name}</p>
        <img src={listings.imageUrls} alt="" />
      </Link>
    </div>
  )
}
