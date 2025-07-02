import { useEffect, useState } from "react";
import MainCard from "../Components/MainCard";
import { BASE_URL } from "../Constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNotificationSocket } from "./SocketContext";
import {
  addFeed,
  setFeedLoading,
  incrementPage,
  setHasMore,
} from "../Utils/feedSlice";
import toast from "react-hot-toast";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const feed = useSelector((store) => store.feed);
  const socket = useNotificationSocket(); 

  useEffect(() => {
    if (!socket) return;
    const handleNotify = ({ fromUser, preview }) => {
      console.log(`📩 (Dashboard) New message from ${fromUser}: ${preview}`);
    };
    socket.on("notifyMessage", handleNotify);
    return () => {
      socket.off("notifyMessage", handleNotify);
    };
  }, []);

  const getFeed = async () => {
    if (!feed.hasMore) return;
    dispatch(setFeedLoading(true));
    try {
      if (!feed) setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/user/feed?page=${feed.page}&limit=8`,
        { withCredentials: true }
      );

      dispatch(addFeed(res.data.data));
      dispatch(setHasMore(res.data.hasMore));
      dispatch(incrementPage());
      setLoading(false);
    } catch (err) {
      toast.error("Issue in loading feed");
    } finally {
      dispatch(setFeedLoading(false));
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="w-full">
      <MainCard getFeed={getFeed} />
    </div>
  );
};

export default Dashboard;
