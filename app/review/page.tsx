"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { CompanySelect } from './components/company-select'
import { FileSelection } from './components/file-selection'
import { PurchaseOrderUpload } from './components/purchase-order-upload'
import { ReviewTypeSelection } from './components/review-type-selection'
import { ReviewResults } from './components/review-results'
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, Settings, Loader2 } from "lucide-react"
import Link from 'next/link'

const API_DOCUMENT_URL = "http://localhost:8000/documents"
const API_REVIEW_CRITERIA_URL = "http://localhost:8000/review_criteria"

// Unified type definitions
type Clause = {
  id: string
  name: string
  description: string
  relevantChunks?: string[]
}

type ReviewCriteriaGroup = {
  id: string
  name: string
  clauses: Clause[]
}

type ReviewResult = {
  clauses: Clause[]
}

type Review = {
  id: string
  company: string
  files: string[]
  purchaseOrder: File | null
  reviewCriteriaGroup: ReviewCriteriaGroup | null
}

type Company = {
  id: string
  name: string
}

type Document = {
  id: string
  name: string
}

export default function ContractReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([{ 
    id: '1', 
    company: '', 
    files: [], 
    purchaseOrder: null, 
    reviewCriteriaGroup: null
  }])
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [reviewResults, setReviewResults] = useState<ReviewResult | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [documents, setDocuments] = useState<Record<string, Document[]>>({})
  const [reviewCriteriaGroups, setReviewCriteriaGroups] = useState<ReviewCriteriaGroup[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCompanies()
    fetchReviewCriteriaGroups()
  }, [])

  useEffect(() => {
    if (reviews[currentReviewIndex].company) {
      fetchDocuments(reviews[currentReviewIndex].company)
    }
  }, [reviews, currentReviewIndex])

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_DOCUMENT_URL}/companies`)
      setCompanies(response.data.data || [])
    } catch (error) {
      console.error("Error fetching companies:", error)
    }
  }

  const fetchDocuments = async (companyId: string) => {
    try {
      const response = await axios.get(`${API_DOCUMENT_URL}/${companyId}`)
      setDocuments(prevDocuments => ({
        ...prevDocuments,
        [companyId]: response.data.data
      }))
    } catch (error) {
      console.error("Error fetching documents:", error)
    }
  }

  const fetchReviewCriteriaGroups = async () => {
    try {
      const response = await axios.get(`${API_REVIEW_CRITERIA_URL}/criteria_groups`)
      setReviewCriteriaGroups(response.data.criteria_groups || [])
    } catch (error) {
      console.error("Error fetching review criteria groups:", error)
    }
  }

  const addReview = () => {
    setReviews([...reviews, { 
      id: Date.now().toString(), 
      company: '', 
      files: [], 
      purchaseOrder: null, 
      reviewCriteriaGroup: null
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
    
    // If the company is updated, reset the files
    if (field === 'company') {
      updatedReviews[currentReviewIndex].files = []
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true) // Set loading to true when starting the review
      const response = await axios.post<ReviewResult>(`http://localhost:8000/reviews/review`, {
        ids: reviews[currentReviewIndex].files
      }, {
        params: {
          review_criteria_group_id: reviews[currentReviewIndex].reviewCriteriaGroup?.id
        }
      })
      setReviewResults(response.data)
      console.log("Review results:", response.data)
    } catch (error) {
      console.error("Error submitting review:", error)
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false) // Set loading to false when the review is complete
    }
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
              onSelect={(companyId) => updateReview('company', companyId)} 
              value={reviews[currentReviewIndex].company}
              companies={companies}
            />
            
            <FileSelection 
              onSelect={(files) => updateReview('files', files)} 
              selectedFiles={reviews[currentReviewIndex].files}
              availableFiles={documents[reviews[currentReviewIndex].company] || []}
            />
{/*             
            <PurchaseOrderUpload 
              onUpload={(file) => updateReview('purchaseOrder', file)} 
              currentFile={reviews[currentReviewIndex].purchaseOrder}
            /> */}
            
            <div className="flex items-center justify-between mb-6">
              <ReviewTypeSelection 
                onSelectGroup={(group) => updateReview('reviewCriteriaGroup', group)} 
                currentGroup={reviews[currentReviewIndex].reviewCriteriaGroup}
                groups={reviewCriteriaGroups}
              />
              <Link href="/review-criteria">
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Review Criteria
                </Button>
              </Link>
            </div>
            
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
        
        {isLoading && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <p className="text-lg font-semibold text-gray-700">Processing Review...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}