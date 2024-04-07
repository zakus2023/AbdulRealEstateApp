import React from 'react'
import '../Components/Banner.css'
import arrow_icon from '../assets/arrow.png'
import house from '../assets/houses.png'
import hand_icon from '../assets/hand_icon.png'

export default function Banner() {
  return (
    <div className='banner'>
      <div className="left-banner">
        <h1>COMPETETIVE PRICING</h1>
        <div>
            <div className="banner-hand-icon">
                <p>New</p>
                <img src={hand_icon} alt="" />
            </div>
            <p>Homes</p>
            <p>For everyone</p>
        </div>
        <div className="banner-latest-btn">
            <div>Let us get started</div>
            <img src={arrow_icon} alt="" />
        </div>
      </div>
      <div className="banner-right">
        <img src={house} alt="" />
      </div>

    </div>
  )
}
