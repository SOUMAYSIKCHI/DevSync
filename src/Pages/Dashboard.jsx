import { useEffect, useState } from "react";
import MainCard from "../Components/MainCard";
import { BASE_URL } from "../Constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addFeed,
  setFeedLoading,
  incrementPage,
  setHasMore,
} from "../Utils/feedSlice";
import toast from "react-hot-toast";
import ProfileCardShimmer from "../../ShimmerPages/ProfileCardShimmer";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading,setLoading] = useState(true);
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    if (!feed.hasMore) return;

    dispatch(setFeedLoading(true));
    try {
     if(!feed)
       setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/user/feed?page=${feed.page}&limit=2`,
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
      {/* {loading ? <ProfileCardShimmer/>: <MainCard getFeed={getFeed} />} */}
      <MainCard getFeed={getFeed}/>
    </div>
  );
};

export default Dashboard;
