import React from 'react'
import footerLogo  from "../assets/footer-logo.png"
import { Link } from 'react-router'

import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-[#5300E4] text-white py-10 px-4">
      {/* Top Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Side - Logo and Nav */}
        <div className="md:w-1/2 w-full">
          <img src={footerLogo} alt="Logo" className="mb-5 w-36" />
          <ul className="flex flex-col md:flex-row gap-4">
            <li><a href="#home" className="hover:text-blue-300">Home</a></li>
            <li><a href="#services" className="hover:text-blue-300">Services</a></li>
            <li><a href="#about" className="hover:text-blue-300">About Us</a></li>
            <li><a href="#contact" className="hover:text-blue-300">Contact</a></li>
          </ul>
        </div>

        {/* Right Side - Newsletter */}
        <div className="md:w-1/2 w-full">
          <p className="mb-4">
            Subscribe to our newsletter to receive the latest updates, news, and offers!
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-white rounded-l-md text-[#5300E4]"
            />
            <Link className="text-white bg-[#5300E4] px-6 py-2 rounded-r-md hover:text-blue-300">
              Subscribe
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-10 border-t border-gray-700 pt-6">
        {/* Left Side - Privacy Links */}
        <ul className="flex gap-6 mb-4 md:mb-0">
          <li><a href="#privacy" className="hover:text-blue-300">Privacy Policy</a></li>
          <li><a href="#terms" className="hover:text-blue-300">Terms of Service</a></li>
        </ul>

        {/* Right Side - Social Icons */}
        <div className="flex gap-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
            <FaFacebook size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
            <FaTwitter size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
      <div className='text-white mx-auto px-4 py-6'>
        <div className="copyright">2025 &#169; StarBooks. All rights reserved</div>
    </div>
    </footer>
    
  )
}

export default Footer

