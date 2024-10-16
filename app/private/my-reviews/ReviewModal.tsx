import React from 'react';

interface Review {
  id: string;
  company: string;
  documents: string[];
  criteriaName: string;
  dateReviewed: string;
}

interface ReviewModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ review, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{review.company}</h2>
        <p><strong>Documents:</strong> {review.documents.join(', ')}</p>
        <p><strong>Criteria:</strong> {review.criteriaName}</p>
        <p><strong>Date Reviewed:</strong> {review.dateReviewed}</p>
        {/* Add more review details here */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
