import React, { useState } from 'react'
import { star_icon, star_dull_icon } from '../assets/assets'

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2025-01-15",
      comment: "Amazing product! Fresh and delivered on time. Will definitely order again.",
      verified: true
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 4,
      date: "2025-01-12",
      comment: "Good quality and fast delivery. The packaging was excellent.",
      verified: true
    },
    {
      id: 3,
      name: "Emily Davis",
      rating: 5,
      date: "2025-01-10",
      comment: "Best online grocery shopping experience! Highly recommended.",
      verified: false
    }
  ])

  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  })

  const [showReviewForm, setShowReviewForm] = useState(false)

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  // Handle form submission
  const handleSubmitReview = (e) => {
    e.preventDefault()
    if (newReview.name.trim() && newReview.comment.trim()) {
      const review = {
        id: reviews.length + 1,
        ...newReview,
        date: new Date().toISOString().split('T')[0],
        verified: false
      }
      setReviews([review, ...reviews])
      setNewReview({ name: '', rating: 5, comment: '' })
      setShowReviewForm(false)
    }
  }

  // Render star rating
  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <img
        key={index}
        src={index < rating ? star_icon : star_dull_icon}
        alt={`${index + 1} star`}
        className={`w-4 h-4 ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
        onClick={() => interactive && onRatingChange && onRatingChange(index + 1)}
      />
    ))
  }

  return (
    <div className="mt-12 border-t pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800">Customer Reviews</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-lg font-medium text-gray-700">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500">({reviews.length} reviews)</span>
          </div>
        </div>
        
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="text-lg font-semibold mb-4">Write Your Review</h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={newReview.name}
                onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex gap-1">
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview({...newReview, rating})
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-24 resize-none"
                placeholder="Share your experience with this product..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">
                    {review.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-semibold text-gray-800">{review.name}</h5>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed ml-13">
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-8">
        <button className="text-green-600 hover:text-green-700 font-medium">
          Load More Reviews
        </button>
      </div>
    </div>
  )
}

export default ProductReviews
