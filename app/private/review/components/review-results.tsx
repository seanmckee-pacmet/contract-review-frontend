import React from 'react'

type Clause = {
  id: string
  name: string
  description: string
  relevantChunks?: string[]
}

type ReviewResult = {
  clauses: Clause[]
}

type ReviewResultsProps = {
  results: ReviewResult
}

export function ReviewResults({ results }: ReviewResultsProps) {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Results</h2>
        {results.clauses.map((clause) => (
          <div key={clause.id} className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{clause.name}</h3>
            <p className="text-gray-600 mb-2">{clause.description}</p>
            {clause.relevantChunks && clause.relevantChunks.length > 0 && (
              <ul className="list-disc pl-6">
                {clause.relevantChunks.map((chunk, chunkIndex) => (
                  <li key={`${clause.id}-chunk-${chunkIndex}`} className="text-gray-600 mb-2">{chunk}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}