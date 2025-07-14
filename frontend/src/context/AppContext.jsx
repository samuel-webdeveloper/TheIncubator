// src/context/AppContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(true);

  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch mentors from backend
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get("/api/mentors");

        if (Array.isArray(res.data)) {
          setMentors(res.data);
        } else {
          console.warn("Mentors API response is not an array:", res.data);
          setMentors([]); // fallback to empty array
        }
      } catch (err) {
        console.error("Failed to fetch mentors:", err);
        setMentors([]); // fallback to empty array on error
      } finally {
        setLoadingMentors(false);
      }
    };

    fetchMentors();
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AppContext.Provider
      value={{ user, setUser, logout, mentors, loadingMentors }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
