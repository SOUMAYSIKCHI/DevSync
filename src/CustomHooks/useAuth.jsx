import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../Utils/userSlice";
import { BASE_URL } from "../Constants";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
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
        setIsAuthLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { isAuthenticated, isAuthLoading };
};

export default useAuth;