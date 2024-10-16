"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { CompanySelect } from './components/company-select'
import { FileSelection } from './components/file-selection'
import { ReviewTypeSelection } from './components/review-type-selection'
import { ReviewResults } from './components/review-results'
import { Button } from "@/components/ui/button"
import { Settings, Loader2 } from "lucide-react"
import Link from 'next/link'

// Replace these constants with the environment variable
const API_DOCUMENT_URL = `${process.env.BASE_URL}/documents`
const API_REVIEW_CRITERIA_URL = `${process.env.BASE_URL}/review_criteria`

type QuoteInfo = {
  document_type: string
  header: string
  content: string
}

type ClauseReview = {
  clause_name: string
  quotes: QuoteInfo[]
}

type ReviewResult = ClauseReview[]

type Company = {
  id: string
  name: string
}

type Document = {
  id: string
  name: string
}

type ReviewCriteriaGroup = {
  id: string
  name: string
  clauses: {
    id: string
    name: string
    description: string
  }[]
}
export default function ContractReviewPage() {
  const [company, setCompany] = useState('')
  const [files, setFiles] = useState<string[]>([])
  const [reviewCriteriaGroup, setReviewCriteriaGroup] = useState<ReviewCriteriaGroup | null>(null)
  const [reviewResults, setReviewResults] = useState<ReviewResult | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [reviewCriteriaGroups, setReviewCriteriaGroups] = useState<ReviewCriteriaGroup[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCompanies()
    fetchReviewCriteriaGroups()
  }, [])

  useEffect(() => {
    if (company) {
      fetchDocuments(company)
    }
  }, [company])

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
      setDocuments(response.data.data || [])
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

  const handleSubmit = async () => {
    if (!company) {
      alert("Please select a company before submitting.");
      return;
    }
  
    if (files.length === 0) {
      alert("Please select at least one document before submitting.");
      return;
    }
  
    if (!reviewCriteriaGroup) {
      alert("Please select a review type before submitting.");
      return;
    }
  
    try {
      setIsLoading(true);
      const response = await axios.post<string[]>(`${process.env.BASE_URL}/reviews/review1`, {
        ids: files
      }, {
        params: {
          review_criteria_group_id: reviewCriteriaGroup.id
        }
      });
      const parsedResults: ReviewResult = response.data.map(item => JSON.parse(item));
      setReviewResults(parsedResults);
      console.log("Review results:", parsedResults);
    } catch (error) {
      console.error("Error submitting review:", error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  }
  const isSubmitDisabled = () => {
    return !company || files.length === 0 || !reviewCriteriaGroup;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
          <div className="px-6 py-8 sm:p-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Contract Review</h1>
            
            <CompanySelect 
              onSelect={setCompany} 
              value={company}
              companies={companies}
            />
            
            <FileSelection 
              onSelect={setFiles} 
              selectedFiles={files}
              availableFiles={documents}
            />
            
            <div className="flex items-center justify-between mb-6">
              <ReviewTypeSelection 
                onSelectGroup={setReviewCriteriaGroup} 
                currentGroup={reviewCriteriaGroup}
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
              <Button 
                onClick={handleSubmit} 
                className="w-full" 
                disabled={isSubmitDisabled()}
              >
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