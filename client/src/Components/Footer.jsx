import React from 'react'
import footer_logo from '../assets/logo.png'
import facebook from '../assets/facebook.jpg'
import instagram from '../assets/instagram.jpg'
import twitter from '../assets/twitter.jpg'
import '../Components/Footer.css'

export default function Footer() {
  return (
    <div className='footer'>
      
      <div className='footer-logo'>
      <img src={footer_logo} alt="" />
      </div>

      <div className='under-logo'>
       <div className="footer-left">
        <h2>Follow Us</h2>
        <div className="social">
        <img src={facebook} alt="" />
        <img src={instagram} alt="" />
        <img src={twitter} alt="" /> 
        </div>
               
      </div> 

      <div className="footer-middle">
        <h2>Newsletter</h2>
        <div className='footer-text'>
        
          <p>Be the first to receive new info of reduced properties with the Abdul-Realtors Newsletter</p>
          <form className='newsletter-form'>
          <input type="text" placeholder='Your email' />
        <button>Sign up</button>
          </form>
        </div>      
      </div>

      <div className="footer-right">
        <h2>Useful Links</h2>
      <ul>
          <li>About</li>
          <li>Blog</li>
          <li>Contact Us</li>
        </ul>
      </div>
      </div>    
      <hr />  
      <div className="copyright">
        <p>All rights reserved. Copyright-2024 @ Abdul-Razak Issah</p>
      </div>
    </div>
  )
}
