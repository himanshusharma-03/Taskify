import React from 'react'
import SideMenu from './SideMenu';
import { useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

const Navbar = () => {
    const [openSideMenu , setOpenSideMenu] = useState(false);
  return (
    <div className='flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30 '>
    <button
    className='block lg:hidden text-black'
    onClick={() =>{
        setOpenSideMenu (!setOpenSideMenu);

    }}
    >
        {openSideMenu ? (
            <HiOutlineX className="text-2xl"></HiOutlineX>
        ) :(
            <HiOutlineX className="text-2xl"></HiOutlineX>
        )}
    </button>
    <h2 className='text-lg font-medium text-black'>Expense Tracker</h2>

    {openSideMenu && (
        <div className='fixed top-[61px] -ml-4 bg-white'>
            <SideMenu activeMenu = {activeMenu}></SideMenu>
        </div>
    )}
      
    </div>
  )
}

export default Navbar;
