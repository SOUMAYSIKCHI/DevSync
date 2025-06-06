import { Star } from 'lucide-react';

const ReviewCard = ({ name, position, review, rating }) => {
  return (
    <div className="bg-gray-700 p-6 rounded-2xl shadow-md flex flex-col gap-4 transition hover:scale-[1.02]">
      <p className="text-white text-sm italic">"{review}"</p>
      <div className="flex items-center gap-2">
        {Array.from({ length: rating }, (_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-gray-500">{position}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
