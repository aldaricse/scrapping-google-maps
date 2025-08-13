import { Star } from 'lucide-react';

export const StarRating = ({ rating = 0, maxStars = 5, size = 24 }) => {
  const renderStar = (index: number) => {
    const starValue = index + 1;
    let fillPercentage = 0;

    if (rating >= starValue) {
      fillPercentage = 100;
    } else if (rating > index) {
      fillPercentage = (rating - index) * 100;
    }

    return (
      <div key={index} className="relative inline-block" style={{ width: size, height: size }}>
        <Star
          size={size}
          className="absolute text-gray-300 stroke-gray-400"
          fill="none"
        />

        {fillPercentage > 0 && (
          <Star
            size={size}
            className="absolute text-yellow-400 stroke-yellow-500"
            fill="currentColor"
            style={{
              clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(maxStars)].map((_, index) => renderStar(index))}
      </div>
    </div>
  );
};