"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Send, User, Star } from "lucide-react"

interface Comment {
  id: string
  user: string
  rating: number
  comment: string
  date: string
  avatar?: string
}

interface CommentsSectionProps {
  productId: string
  comments?: Comment[]
}

export default function CommentsSection({ productId, comments = [] }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [newRating, setNewRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Placeholder comments - replace with real data from Supabase
  const placeholderComments: Comment[] = [
    {
      id: "1",
      user: "Maria G.",
      rating: 5,
      comment: "Absolutely love this piece! The Miami kitsch aesthetic is perfect and the quality is amazing. Will definitely buy more from La Esquinita!",
      date: "2024-01-20T10:30:00Z",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: "2",
      user: "Carlos R.",
      rating: 4,
      comment: "Great product, fast shipping. The colors are vibrant and it's exactly as described. Would recommend!",
      date: "2024-01-18T15:45:00Z",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: "3",
      user: "Ana L.",
      rating: 5,
      comment: "Perfect addition to my Miami-themed collection. The craftsmanship is outstanding and it arrived well-packaged.",
      date: "2024-01-15T09:20:00Z",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ]

  const displayComments = comments.length > 0 ? comments : placeholderComments

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // TODO: Submit comment to Supabase
    console.log("Submitting comment:", { productId, rating: newRating, comment: newComment })
    
    setNewComment("")
    setNewRating(5)
    setIsSubmitting(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-sugar-pink p-6">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="w-6 h-6 text-mint-rot" />
        <h3 className="text-xl font-skeleton text-mint-rot">Customer Reviews</h3>
      </div>

      {/* Add Comment Form */}
      <motion.form 
        onSubmit={handleSubmitComment}
        className="mb-8 p-4 bg-gradient-to-br from-sugar-pink/10 to-icing-white rounded-xl border border-sugar-pink/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h4 className="text-lg font-medium text-mint-rot mb-4">Write a Review</h4>
        
        {/* Rating Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-mint-rot mb-2">Your Rating</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewRating(star)}
                className="transition-transform duration-200 hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= newRating
                      ? 'text-miami-yellow fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-mint-rot mb-2">Your Review</label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            className="w-full p-3 border-2 border-sugar-pink rounded-xl resize-none focus:outline-none focus:border-miami-pink transition-colors"
            rows={4}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="bg-mint-rot text-white px-6 py-2 rounded-xl font-medium hover:bg-opacity-90 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
        </button>
      </motion.form>

      {/* Comments List */}
      <div className="space-y-6">
        {displayComments.map((comment, index) => (
          <motion.div
            key={comment.id}
            className="border-b border-gray-200 pb-6 last:border-b-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {comment.avatar ? (
                  <img
                    src={comment.avatar}
                    alt={comment.user}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-sugar-pink rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-mint-rot" />
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-mint-rot">{comment.user}</span>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= comment.rating
                            ? 'text-miami-yellow fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-2">{comment.comment}</p>
                
                <span className="text-sm text-gray-500">
                  {formatDate(comment.date)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {displayComments.length === 0 && (
        <motion.div 
          className="text-center py-8 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No reviews yet. Be the first to review this product!</p>
        </motion.div>
      )}
    </div>
  )
} 