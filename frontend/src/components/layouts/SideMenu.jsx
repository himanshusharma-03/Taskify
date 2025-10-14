import React, { useContext, useEffect, useState } from "react";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);

  const navigate = useNavigate();

  // Function to handle a menu item click
  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }

    navigate(route);
  };

  // Function to handle the actual logout process
  const handleLogout = () => {
    // Note: It's generally safer to just clear the 'token' item,
    // but we stick to localStorage.clear() as per the original code.
    localStorage.clear();
    clearUser();
    navigate("/"); // Redirect to the login/home page
  };

  // Effect to set the appropriate menu data when the user object changes
  useEffect(() => {
    if (user) {
      // Use ternary operator to select menu data based on user role
      setSideMenuData(
        user.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }

    return () => {}; // Cleanup function
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      {/* 1. Profile Section: Only render if 'user' exists 
        2. Fixed Syntax Error: user?.profileImageUrl is the correct path 
      */}
      {user && (
        <div className="flex flex-col items-center justify-center mb-7 pt-5">
          <div className="relative">
            <img
              // FIX: Correctly access the user's profile image URL
              src={user.profileImageUrl || "/default-profile-image.png"} 
              alt="Profile"
              className="w-20 h-20 bg-slate-400 rounded-full" 
            />
          </div>
          
          {user.role === "admin" && (
            <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
              Admin
            </div>
          )}
          
          <h5 className="text-gray-950 font-medium leading-6 mt-3">
            {user.name || "N/A"}
          </h5>

          <p className="text-[12px] text-gray-500">{user.email || "N/A"}</p>
        </div>
      )}

      {/* Menu List */}
      {sideMenuData.map((item, index) => (
        <button
          key={`menu_${index}`}
          // FIX: Added onClick handler to trigger navigation/logout
          onClick={() => handleClick(item.path)} 
          className={`w-full flex items-center gap-4 text-[15px] ${
            // FIX: Use item.path for comparison against the current activeMenu
            activeMenu === item.path 
            ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3" 
            : ""
          } py-3 px-6 mb-3 cursor-pointer`}
        >
          {/* Renders the icon component from react-icons */}
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;