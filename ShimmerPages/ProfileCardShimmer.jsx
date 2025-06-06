import Shimmer from './Shimmer';

// Profile Card Shimmer
const ProfileCardShimmer = () => (
  <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4'>
    <div className="w-full  max-w-md bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
      {/* Header Shimmer */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4">
        <div className="flex items-center justify-between">
          <Shimmer className="h-6 w-20 rounded-md" />
          <Shimmer className="w-8 h-8 rounded-full" />
        </div>
      </div>

      {/* Profile Card Content */}
      <div className="p-6">
        {/* Main Image Shimmer */}
        <div className="relative w-full h-96 bg-gray-700 rounded-2xl overflow-hidden mb-4">
          <Shimmer className="w-full h-full" />
          
          {/* Image Indicators Shimmer */}
          <div className="absolute top-4 left-4 flex space-x-1">
            {[1, 2, 3].map((i) => (
              <Shimmer key={i} className="h-1 w-6 rounded-full" />
            ))}
          </div>
          
          {/* Online Status Shimmer */}
          <Shimmer className="absolute top-4 right-4 w-4 h-4 rounded-full" />
          
          {/* Profile Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shimmer className="h-8 w-24 rounded-md" />
              <Shimmer className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </div>

        {/* Bio Shimmer */}
        <div className="mb-4 space-y-2">
          <Shimmer className="h-4 w-full rounded-md" />
          <Shimmer className="h-4 w-3/4 rounded-md" />
          <Shimmer className="h-4 w-1/2 rounded-md" />
        </div>

        {/* Skills Section Shimmer */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Shimmer className="w-4 h-4 rounded" />
            <Shimmer className="h-4 w-16 rounded-md" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Shimmer key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        </div>

        {/* Action Buttons Shimmer */}
        <div className="flex justify-center space-x-4 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <Shimmer key={i} className="w-14 h-14 rounded-full" />
          ))}
        </div>

        {/* Additional Buttons Shimmer */}
        <div className="flex justify-center space-x-3">
          <Shimmer className="h-8 w-20 rounded-full" />
          <Shimmer className="h-8 w-24 rounded-full" />
        </div>
      </div>

      {/* Bottom Hint Shimmer */}
      <div className="bg-gray-900 px-6 py-3 border-t border-gray-700">
        <Shimmer className="h-3 w-3/4 mx-auto rounded-md" />
      </div>
    </div>
  </div>
);

export default ProfileCardShimmer;