import React from 'react'

type QuoteInfo = {
  document_type: string
  header: string
  content: string
}

type ClauseReview = {
  clause_name: string
  quotes: QuoteInfo[]
}

type ReviewResultsProps = {
  results: ClauseReview[]
}

export function ReviewResults({ results }: ReviewResultsProps) {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Results</h2>
        {results.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{group.clause_name}</h3>
            {group.quotes.map((quote, quoteIndex) => (
              <div key={`${groupIndex}-${quoteIndex}`} className="mb-4 p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-medium text-gray-700">{quote.header}</h4>
                  <span className="text-sm font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {quote.document_type}
                  </span>
                </div>
                <p className="text-gray-600">{quote.content}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}