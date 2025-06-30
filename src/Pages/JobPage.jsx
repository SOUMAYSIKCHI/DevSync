import { useEffect, useState } from "react";
import {
  Building2,
  Clock,
  Users,
  Code,
  MapPin,
  DollarSign,
  Briefcase,
  Search,
  Filter,
  ChevronDown,
  X,
  ArrowUp, // Import the ArrowUp icon
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../Constants";
import { useDispatch, useSelector } from "react-redux";
import { addJobs } from "../Utils/JobSlice";

const JobCard = ({ job }) => {
  const getDaysAgo = (dateString) => {
    const postedDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - postedDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  // Truncate company name and description
  const truncatedCompany =
    job.company.length > 20
      ? job.company.slice(0, 20) + "..."
      : job.company;
  const truncatedDescription =
    job.description.length > 90
      ? job.description.slice(0, 90) + "..."
      : job.description;

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition-all duration-300 hover:border-gray-600 flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-300 bg-gray-600 px-2 py-1 rounded-full">
            {getDaysAgo(job.postedDate)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Company Logo */}
        <div className="flex items-center justify-center mb-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {job.company.charAt(0)}
          </div>
        </div>

        {/* Job Info */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-white mb-1">{job.title}</h3>
          <div className="flex items-center justify-center space-x-1 mb-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">{truncatedCompany}</span>
          </div>
          <div className="flex items-center justify-center space-x-1 mb-2">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">{job.location}</span>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-gray-400">{job.jobType}</span>
            </div>
            <div className="flex items-center space-x-1 text-green-400 font-medium">
              <DollarSign className="w-3 h-3" />
              <span>{job.salary}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-xs">
            <Users className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400">Batch: {job.eligibleBatch}</span>
          </div>

          {/* Skills */}
          <div className="flex items-start space-x-1">
            <Code className="w-3 h-3 text-gray-400 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {job.skillsRequired.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
              {job.skillsRequired.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-600 text-white text-[10px] rounded-full text-[10px]">
                  +{job.skillsRequired.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-xs text-gray-400 leading-relaxed mb-4 flex-grow">
          {truncatedDescription}
        </div>

        {/* Apply Button */}
        <div className="flex justify-center mt-auto">
          {" "}
          {/* Use mt-auto to push to bottom */}
          <a
            href={job.applyNow}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
};

const JobPage = () => {
  const jobs = useSelector((state) => state.job);
  const dispatch = useDispatch();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobType: "",
    eligibleBatch: "",
    skills: "",
    company: "",
  });
  const [showScrollToTop, setShowScrollToTop] = useState(false); // State for button visibility

  const fetchJobs = async () => {
    if (jobs.length === 0) {
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

    // Event listener for scroll to show/hide the button
    const handleScroll = () => {
      if (window.scrollY > 300) {
        // Show button after scrolling 300px
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, []);

  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll effect
    });
  };

  // Filter and search jobs
  useEffect(() => {
    let filtered = [...jobs];

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.skillsRequired.some((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.jobType) {
      filtered = filtered.filter((job) =>
        job.jobType.toLowerCase().includes(filters.jobType.toLowerCase())
      );
    }

    if (filters.eligibleBatch) {
      filtered = filtered.filter((job) =>
        job.eligibleBatch
          .toLowerCase()
          .includes(filters.eligibleBatch.toLowerCase())
      );
    }

    if (filters.skills) {
      filtered = filtered.filter((job) =>
        job.skillsRequired.some((skill) =>
          skill.toLowerCase().includes(filters.skills.toLowerCase())
        )
      );
    }

    if (filters.company) {
      filtered = filtered.filter((job) =>
        job.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, filters]);

  const clearFilters = () => {
    setFilters({
      jobType: "",
      eligibleBatch: "",
      skills: "",
      company: "",
    });
    setSearchQuery("");
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header with Search and Filters */}
      <div className="sticky top-0 z-10 bg-gray-900/70 backdrop-blur-md border-b border-gray-700 p-4 rounded-b-3xl">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/60 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-full text-white hover:bg-gray-700/60 transition-colors flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-800/60 rounded-lg p-4 mb-4 border border-gray-700 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Job Type
                  </label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange("jobType", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/70 border border-gray-600 rounded-md text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">All Types</option>
                    <option value="internship">Internship</option>
                    <option value="job">Job</option>
                    <option value="fulltime">Full Time</option>
                    <option value="hackathon">Hackathon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Company name"
                    value={filters.company}
                    onChange={(e) => handleFilterChange("company", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/70 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Eligible Batch
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024, 2025"
                    value={filters.eligibleBatch}
                    onChange={(e) =>
                      handleFilterChange("eligibleBatch", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-700/70 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Skills
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Python"
                    value={filters.skills}
                    onChange={(e) => handleFilterChange("skills", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/70 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="text-gray-400 text-sm mt-2">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="max-w-7xl mx-auto p-4 py-8">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Jobs Found</h2>
            <p className="text-gray-400 mb-4">
              {jobs.length === 0
                ? "Loading jobs..."
                : "Try adjusting your search or filters"}
            </p>
            {jobs.length > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredJobs.map((job, index) => (
              <JobCard key={index} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default JobPage;
