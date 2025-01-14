import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

const RatingStars = ({ rating, size = 'md' }: RatingStarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const starSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={`${starSizes[size]} text-yellow-400 fill-current`}
        />
      ))}
      {hasHalfStar && (
        <StarHalf className={`${starSizes[size]} text-yellow-400 fill-current`} />
      )}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={`${starSizes[size]} text-gray-300`}
        />
      ))}
    </div>
  );
};

export default RatingStars;