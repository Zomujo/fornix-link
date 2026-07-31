import React, { JSX } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  /** Omit for read-only display (e.g. landing page reviews). */
  onRatingChange?: (rating: number) => void;
  maxRating?: number;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export const StarRating = ({
  rating,
  onRatingChange,
  maxRating = 5,
  className,
  disabled = false,
  size = 'md',
}: StarRatingProps): JSX.Element => {
  const isReadOnly = disabled || !onRatingChange;
  const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role={isReadOnly ? 'img' : undefined}
      aria-label={isReadOnly ? `Rated ${rating} out of ${maxRating}` : undefined}
    >
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        const star = (
          <Star
            className={cn(
              starSize,
              'transition-colors',
              isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200',
            )}
          />
        );

        if (isReadOnly) {
          return (
            <span key={starValue} className="inline-flex" aria-hidden>
              {star}
            </span>
          );
        }

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onRatingChange?.(starValue)}
            className="cursor-pointer transition-colors hover:scale-110 focus:outline-none"
          >
            {star}
          </button>
        );
      })}
    </div>
  );
};
