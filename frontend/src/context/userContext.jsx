import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // New state to track loading: true initially as we check for the token/user
  const [loading, setLoading] = useState(true);

  // Function to clear the user and token
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  // Function to fetch user profile data
  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
      setUser(response.data);
    } catch (error) {
      // If fetching fails (e.g., token expired or invalid), clear the user state
      console.error("User not authenticated", error);
      clearUser();
    } finally {
      // Once the check is complete (success or failure), set loading to false
      setLoading(false);
    }
  };

  // Function to update the user state and save a new token (used on login/registration)
  const updateUser = (userData) => {
    setUser(userData);
    // Save the new token received after login/registration
    localStorage.setItem("token", userData.token);
    setLoading(false);
  };
  
  // Effect to run once on component mount to check for an existing token
  useEffect(() => {
    // If user is already set, no need to run the check
    if (user) return;

    const accessToken = localStorage.getItem("token");

    if (!accessToken) {
      // If no token exists, we are done, and the user is null
      setLoading(false);
      return;
    }

    // If a token exists, attempt to fetch the user profile
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;