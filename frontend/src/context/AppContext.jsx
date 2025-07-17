// src/context/AppContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
  }, []);

  // Sync user state to localStorage when it changes
  const setUser = (updatedUser) => {
    setUserState(updatedUser);
    if (updatedUser) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUserState(null);
  };

  // Fetch mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get("/api/mentors");

        if (Array.isArray(res.data)) {
          setMentors(res.data);
        } else {
          console.warn("Mentors API response is not an array:", res.data);
          setMentors([]); // fallback
        }
      } catch (err) {
        console.error("Failed to fetch mentors:", err);
        setMentors([]);
      } finally {
        setLoadingMentors(false);
      }
    };

    fetchMentors();
  }, []);

  return (
    <AppContext.Provider
      value={{ user, setUser, logout, mentors, loadingMentors }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
