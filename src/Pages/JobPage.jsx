import { useEffect, useState } from "react";
import {
  Building2,
  Clock,
  Users,
  Code,
  MapPin,
  DollarSign,
  Heart,
  X,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../Constants";
import { useDispatch, useSelector } from "react-redux";
import { addJobs } from "../Utils/JobSlice";

const JobCard = ({ job, onIgnore }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const animateSwipe = (direction) => {
    setIsAnimating(true);
    setSwipeDirection(direction);
    setTimeout(() => {
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  };

  const handleAction = (action) => {
    if (action === "ignore") {
      animateSwipe("left");
      setTimeout(() => onIgnore(job), 150);
    }
  };
  const getDaysAgo = (dateString) => {
    const postedDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - postedDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const getCardStyle = () => {
    if (isAnimating) {
      const translateX = swipeDirection === "right" ? "100%" : "-100%";
      const rotate = swipeDirection === "right" ? "15deg" : "-15deg";
      return {
        transform: `translateX(${translateX}) rotate(${rotate})`,
        opacity: 0,
        transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
      };
    } else {
      return {
        transform: "translateX(0px) rotate(0deg)",
        transition: "transform 0.3s ease-out",
      };
    }
  };

  return (
    <div
      className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700"
      style={getCardStyle()}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Job Opportunity</h2>
          <span className="text-xs text-gray-300 bg-gray-600 px-2 py-1 rounded">
            {getDaysAgo(job.postedDate)}
          </span>
        </div>
      </div>

      {/* Job Card Content */}
      <div className="p-6">
        <div className="relative">
          {/* Company Logo Container */}
          <div className="relative w-full h-96 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl overflow-hidden shadow-lg mb-4 select-none">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            {/* Company Logo */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
                {job.company.charAt(0)}
              </div>
            </div>

            {/* Job Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-2xl font-bold">{job.title}</h3>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Building2 className="w-4 h-4" />
                <span className="text-lg font-medium">{job.company}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">
                  <span className="font-medium text-gray-200">Job Type:</span>{" "}
                  {job.jobType}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-green-400 font-medium">
                <DollarSign className="w-4 h-4" />
                <span>{job.salary}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">
                <span className="font-medium text-gray-200">
                  Eligible Batch:
                </span>{" "}
                {job.eligibleBatch}
              </span>
            </div>

            <div className="flex items-start space-x-2">
              <Code className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="text-sm text-gray-300">
                <span className="font-medium text-gray-200">
                  Skills Required:
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="text-sm text-gray-300 leading-relaxed">
              {job.description.length > 200
                ? job.description.slice(0, 200) + "..."
                : job.description}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {/* Ignore Button */}
            <button
              onClick={() => handleAction("ignore")}
              className="w-14 h-14 cursor-pointer bg-gray-700 border-2 border-gray-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-gray-600 transform hover:scale-105 transition-all duration-200"
            >
              <X className="w-6 h-6 text-red-400" />
            </button>

            {/* Apply Button as <a> */}
            <a
              href={job.applyNow}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 cursor-pointer bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Heart className="w-6 h-6 text-white" />
            </a>
          </div>

          {/* Additional Action Button */}
          <div className="flex justify-center space-x-3 mt-4">
            <a
              href={job.applyNow}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Hint */}
      <div className="bg-gray-900 px-6 py-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 flex items-center">
          <X className="w-4 h-4 text-red-400 mr-2" />
          Skip this job opportunity
        </p>
        <p className="text-xs pt-2 text-gray-500 flex items-center">
          <Heart className="w-4 h-4 text-white mr-2" />
          Apply for this position
        </p>
      </div>
    </div>
  );
};

const JobPage = () => {
  const jobs = useSelector((state) => state.job);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const dispatch = useDispatch();
  const fetchJobs = async () => {
    if (jobs.length===0) {
      try {
        const res = await axios.get(`${BASE_URL}/user/jobs`, {
          withCredentials: true,
        });
        dispatch(addJobs(res.data));
      } catch (err) {
        toast.error("Server is Down");
      }
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleIgnore = () => {
    if (currentJobIndex < jobs.length - 1) {
      setCurrentJobIndex((prev) => prev + 1);
    } else {
      setCurrentJobIndex(0);
    }
  };

  // Get current job
  const currentJob = jobs[currentJobIndex];

  // Show completion message if no more jobs
  if (!currentJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No More Jobs!</h2>
          <p className="text-gray-400 mb-4">
            You've seen all available opportunities
          </p>
          <button
            onClick={() => setCurrentJobIndex(0)}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <JobCard job={currentJob} onIgnore={handleIgnore} />
    </div>
  );
};

export default JobPage;
