'use client'

import { useState } from 'react';
import ReviewModal from './ReviewModal';

interface Review {
  id: string;
  company: string;
  documents: string[];
  criteriaName: string;
  dateReviewed: string;
}

// Sample data
const sampleReviews: Review[] = [
  {
    id: '1',
    company: 'TechCorp Inc.',
    documents: ['Privacy Policy', 'Terms of Service'],
    criteriaName: 'GDPR Compliance',
    dateReviewed: '2023-04-15',
  },
  {
    id: '2',
    company: 'EcoFriendly Solutions',
    documents: ['Environmental Impact Report', 'Sustainability Statement'],
    criteriaName: 'Environmental Standards',
    dateReviewed: '2023-04-10',
  },
  {
    id: '3',
    company: 'FinanceHub',
    documents: ['Investment Prospectus', 'Risk Assessment'],
    criteriaName: 'Financial Regulations',
    dateReviewed: '2023-04-05',
  },
];

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (reviewId: string) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openReviewModal = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedReview(null);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Reviews</h1>
      {reviews.length === 0 ? (
        <p>You haven't saved any reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">{review.company}</h2>
              <p><strong>Documents:</strong> {review.documents.join(', ')}</p>
              <p><strong>Criteria:</strong> {review.criteriaName}</p>
              <p><strong>Date Reviewed:</strong> {formatDate(review.dateReviewed)}</p>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => openReviewModal(review)}
                  className="text-blue-600 hover:underline"
                >
                  View Full Review
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          isOpen={isModalOpen}
          onClose={closeReviewModal}
        />
      )}
    </div>
  );
}
