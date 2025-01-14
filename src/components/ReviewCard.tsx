import React from 'react';
import RatingStars from './RatingStars';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReviewCardProps {
  author: string;
  date: string;
  rating: number;
  comment: string;
  userImage?: string;
}

const ReviewCard = ({ author, date, rating, comment, userImage }: ReviewCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            src={userImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
            alt={author}
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">{author}</p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })}
            </p>
          </div>
          <RatingStars rating={rating} size="sm" />
          <p className="mt-2 text-sm text-gray-600">{comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;