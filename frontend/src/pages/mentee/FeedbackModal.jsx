import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const FeedbackModal = ({ session, onClose, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating || comment.trim().length < 3) {
      return toast.warning('Please select a rating and write a brief comment');
    }

    try {
      setLoading(true);
      await axios.put(`/api/sessions/${session.id || session._id}/feedback`, {
        rating,
        comment,
      });

      toast.success('Feedback submitted successfully');
      onSubmitted(); // Optional callback to refresh parent
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
        <h3 className="text-xl font-bold text-primary mb-4">Session Feedback</h3>
        <p className="text-sm text-gray-600 mb-2">
          {session.mentorName || session.mentor?.name} — {session.speciality}
        </p>

        {/* ⭐ Star Rating */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={24}
              className={`cursor-pointer transition-colors ${
                (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        {/* Comment Box */}
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-primary"
          placeholder="Leave a comment about the session..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
