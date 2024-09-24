"use client"

import { useState } from 'react'
import { CompanySelect } from './components/company-select'
import { FileSelection } from './components/file-selection'
import { PurchaseOrderUpload } from './components/purchase-order-upload'
import { ReviewTypeSelection } from './components/review-type-selection'
import { ReviewResults } from './components/review-results'
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2 } from "lucide-react"

type Clause = {
  id: string
  name: string
  description: string
}

type Review = {
  id: string
  company: string
  files: string[]
  purchaseOrder: File | null
  reviewType: 'general' | 'custom'
  clauses: Clause[]
}

export default function ContractReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([{ 
    id: '1', 
    company: '', 
    files: [], 
    purchaseOrder: null, 
    reviewType: 'general', 
    clauses: [] 
  }])
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [reviewResults, setReviewResults] = useState<any>(null)

  const addReview = () => {
    setReviews([...reviews, { 
      id: Date.now().toString(), 
      company: '', 
      files: [], 
      purchaseOrder: null, 
      reviewType: 'general', 
      clauses: [] 
    }])
    setCurrentReviewIndex(reviews.length)
  }

  const removeReview = (index: number) => {
    const newReviews = reviews.filter((_, i) => i !== index)
    setReviews(newReviews)
    setCurrentReviewIndex(Math.min(currentReviewIndex, newReviews.length - 1))
  }

  const updateReview = (field: keyof Review, value: any) => {
    const updatedReviews = [...reviews]
    updatedReviews[currentReviewIndex] = { ...updatedReviews[currentReviewIndex], [field]: value }
    setReviews(updatedReviews)
  }

  const handleSubmit = () => {
    // Simulating API call with setTimeout
    setTimeout(() => {
      const mockResults = reviews.map(review => ({
        id: review.id,
        company: review.company,
        clauses: review.clauses.map(clause => ({
          name: clause.name,
          quotes: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          ]
        }))
      }))
      setReviewResults(mockResults)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
          <div className="px-6 py-8 sm:p-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Contract Review</h1>
            
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {reviews.map((_, index) => (
                  <Button
                    key={index}
                    variant={index === currentReviewIndex ? "default" : "outline"}
                    onClick={() => setCurrentReviewIndex(index)}
                  >
                    Review {index + 1}
                  </Button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={addReview} variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Review
                </Button>
                {reviews.length > 1 && (
                  <Button onClick={() => removeReview(currentReviewIndex)} variant="outline" className="text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Current
                  </Button>
                )}
              </div>
            </div>
            
            <CompanySelect 
              onSelect={(company) => updateReview('company', company)} 
              value={reviews[currentReviewIndex].company}
            />
            
            <FileSelection 
              onSelect={(files) => updateReview('files', files)} 
              selectedFiles={reviews[currentReviewIndex].files}
            />
            
            <PurchaseOrderUpload 
              onUpload={(file) => updateReview('purchaseOrder', file)} 
              currentFile={reviews[currentReviewIndex].purchaseOrder}
            />
            
            <ReviewTypeSelection 
              onSelectType={(type) => updateReview('reviewType', type)} 
              onCustomClausesChange={(clauses) => updateReview('clauses', clauses)}
              currentType={reviews[currentReviewIndex].reviewType}
              currentClauses={reviews[currentReviewIndex].clauses}
            />
            
            <div className="mt-8">
              <Button onClick={handleSubmit} className="w-full">
                Submit for Review
              </Button>
            </div>
          </div>
        </div>
        
        {reviewResults && (
          <ReviewResults results={reviewResults} />
        )}
      </div>
    </div>
  )
}