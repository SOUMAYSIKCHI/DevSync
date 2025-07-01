import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../Constants";
import {toast } from "react-hot-toast"
import {
  Building2,
  Clock,
  Users,
  Code,
  MapPin,
  DollarSign,
  Briefcase,
  Eye,
  Plus,
  Shield,
  AlertTriangle,
} from "lucide-react";

// Unknown/Unauthorized component
const Unknown = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 text-center max-w-md">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400 mb-4">
          You don't have permission to access this page. Admin access required.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          <span>Admin Only Area</span>
        </div>
      </div>
    </div>
  );
};

const JobCard = ({ job }) => {
  const getDaysAgo = () => "Today";

  // Truncate company name and description
  const truncatedCompany =
    job.company && job.company.length > 20
      ? job.company.slice(0, 20) + "..."
      : job.company || "Company Name";
  const truncatedDescription =
    job.description && job.description.length > 90
      ? job.description.slice(0, 90) + "..."
      : job.description || "Job description will appear here...";

  const skills = job.skillsRequired 
    ? (typeof job.skillsRequired === 'string' 
        ? job.skillsRequired.split(',').map(s => s.trim()).filter(s => s)
        : job.skillsRequired)
    : [];

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition-all duration-300 hover:border-gray-600 flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-300 bg-gray-600 px-2 py-1 rounded-full">
            {getDaysAgo()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Company Logo */}
        <div className="flex items-center justify-center mb-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {(job.company || "C").charAt(0)}
          </div>
        </div>

        {/* Job Info */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-white mb-1">{job.title || "Job Title"}</h3>
          <div className="flex items-center justify-center space-x-1 mb-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">{truncatedCompany}</span>
          </div>
          <div className="flex items-center justify-center space-x-1 mb-2">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">{job.location || "Location"}</span>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-gray-400">{job.jobType || "Job Type"}</span>
            </div>
            <div className="flex items-center space-x-1 text-green-400 font-medium">
              <DollarSign className="w-3 h-3" />
              <span>{job.salary || "Salary"}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-xs">
            <Users className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400">Batch: {job.eligibleBatch || "2024"}</span>
          </div>

          {/* Skills */}
          <div className="flex items-start space-x-1">
            <Code className="w-3 h-3 text-gray-400 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-600 text-white text-[10px] rounded-full">
                  +{skills.length - 3}
                </span>
              )}
              {skills.length === 0 && (
                <span className="px-2 py-0.5 bg-gray-600 text-white text-[10px] rounded-full">
                  Skills
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
          <div className="w-full px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-lg shadow-md text-center">
            Apply Now
          </div>
        </div>
      </div>
    </div>
  );
};

function JobUpdate() {
  const userRole = useSelector(state => state.user.role);
  
  if (userRole !== "admin") {
    return <Unknown />;
  }

  const [form, setForm] = useState({
    company: "",
    title: "",
    location: "",
    jobType: "Internship", 
    eligibleBatch: "",
    skillsRequired: "",
    salary: "",
    description: "",
    applyNow: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      ...form,
      skillsRequired: form.skillsRequired.split(",").map((s) => s.trim())
    };
    
    try {
      const res = await axios.post(`${BASE_URL}/admin/updateJob`, payload, {
        withCredentials: true,
      });
      toast.success("✅ Job posted successfully!");
      setForm({
        company: "",
        title: "",
        location: "",
        jobType: "Internship",
        eligibleBatch: "",
        skillsRequired: "",
        salary: "",
        description: "",
        applyNow: ""
      });
    } catch (err) {
      console.error("Error posting job:", err);
      toast.error("❌ Failed to post job. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Plus className="w-8 h-8 text-purple-400" />
            Post New Job
          </h1>
          <p className="text-gray-400">Create a new job posting and see how it will look</p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Admin Access</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-purple-400" />
              Job Details
            </h2>
            
            <div onSubmit={handleSubmit} className="space-y-6">
              {/* Grid for form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                    placeholder="Enter company name"
                    required
                  />
                </div>

                {/* Job Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                    placeholder="Enter job title"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                    placeholder="Enter location"
                    required
                  />
                </div>

                {/* Eligible Batch */}
                <div>
                  <label htmlFor="eligibleBatch" className="block text-sm font-medium text-gray-300 mb-2">
                    Eligible Batch *
                  </label>
                  <input
                    type="text"
                    id="eligibleBatch"
                    name="eligibleBatch"
                    value={form.eligibleBatch}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                    placeholder="e.g., 2024, 2025"
                    required
                  />
                </div>

                {/* Salary */}
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-2">
                    Salary *
                  </label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                    placeholder="e.g., 5 LPA, Negotiable"
                    required
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-300 mb-2">
                    Job Type *
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={form.jobType}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                    required
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              {/* Skills - Full Width */}
              <div>
                <label htmlFor="skillsRequired" className="block text-sm font-medium text-gray-300 mb-2">
                  Skills Required *
                </label>
                <input
                  type="text"
                  id="skillsRequired"
                  name="skillsRequired"
                  value={form.skillsRequired}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                  placeholder="e.g., React, Python, JavaScript (comma separated)"
                  required
                />
              </div>

              {/* Apply Link - Full Width */}
              <div>
                <label htmlFor="applyNow" className="block text-sm font-medium text-gray-300 mb-2">
                  Apply Link *
                </label>
                <input
                  type="url"
                  id="applyNow"
                  name="applyNow"
                  value={form.applyNow}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                  placeholder="https://company.com/apply"
                  required
                />
              </div>

              {/* Description - Full Width */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 resize-y"
                  placeholder="Describe the job role, responsibilities, and requirements..."
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 font-semibold rounded-lg shadow-lg transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    isSubmitting
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-xl hover:scale-105"
                  }`}
                >
                  {isSubmitting ? "Posting Job..." : "Post Job"}
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6 text-purple-400" />
              Live Preview
            </h2>
            
            <div className="sticky top-6">
              <div className="mb-4">
                <p className="text-sm text-gray-400">
                  This is how your job posting will appear to students
                </p>
              </div>
              
              <div className="max-w-sm mx-auto">
                <JobCard job={form} />
              </div>
              
              <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Preview Notes:</h3>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Skills will be shown as tags (first 3 visible)</li>
                  <li>• Long descriptions are automatically truncated</li>
                  <li>• Company names over 20 characters are shortened</li>
                  <li>• Posted date will show "Today" when published</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobUpdate;