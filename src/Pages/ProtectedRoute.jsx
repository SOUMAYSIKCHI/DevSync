// Pages/ProtectedRoute.js
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../Utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../Constants";
import LoadingSpinner from "../LandingPages/LoadingSpinner";
const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/profileView", {
          withCredentials: true,
        });
        if (res.status === 200) {
          dispatch(addUser(res.data.user));
          setIsAuthenticated(true);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <LoadingSpinner />;

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
