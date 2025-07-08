import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';

const Navbar = () => {
  const { user, setUser,setShowLogin,logout,credit } = useContext(AppContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('imagify-user');
    navigate('/');
  };

  return (
    <div className='flex items-center justify-between px-4 py-4 relative'>
      <Link to="/">
        <img src={assets.logo} alt="Imagify Logo" className='w-28 sm:w-32 lg:w-40' />
      </Link>

      <div className='flex items-center gap-3 sm:gap-5'>
        <p onClick={() => navigate('/buy')} className='cursor-pointer'>Pricing</p>

        {user ? (
          <div className='flex items-center gap-3 relative'>
            <button onClick={() => navigate('/buy')} className='flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full hover:scale-105 transition-all duration-300'>
              <img src={assets.credit_star} alt="credits" className='w-5' />
              <p className='text-sm text-gray-600'>Credits left: {user.credits}</p>
            </button>

            {/* Hi Sparsh text */}
            <p className='text-gray-600 hidden sm:block'>Hi, {user.name}</p>

            {/* Profile icon */}
            <div className='relative'>
              <img
                src={assets.profile_icon} // random avatar or use a user.avatar field
                alt="Profile"
                className='w-10 h-10 rounded-full cursor-pointer'
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {/* Dropdown */}
              {dropdownOpen && (
                <div className='absolute top-12 right-0 bg-white border shadow-md rounded-md w-32 z-10'>
                  <button 
                    onClick={logout}
                    className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={()=> setShowLogin(true)}
            className='bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full'
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
