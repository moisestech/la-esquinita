"use client"

import React from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showScore?: boolean
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showScore = false,
  interactive = false,
  onRatingChange
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }

  const handleStarClick = (starIndex: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex + 1)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1
          const isFilled = starValue <= rating
          const isHalfFilled = starValue === Math.ceil(rating) && rating % 1 !== 0
          
          return (
            <button
              key={index}
              onClick={() => handleStarClick(index)}
              disabled={!interactive}
              className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-200`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled
                    ? 'text-miami-yellow fill-current'
                    : isHalfFilled
                    ? 'text-miami-yellow fill-current opacity-50'
                    : 'text-gray-300'
                }`}
              />
            </button>
          )
        })}
      </div>
      
      {showScore && (
        <span className="text-sm text-gray-600">
          {rating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  )
} 