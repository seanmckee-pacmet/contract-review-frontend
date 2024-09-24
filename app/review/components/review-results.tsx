import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

type ReviewResult = {
  id: string
  company: string
  clauses: {
    name: string
    quotes: string[]
  }[]
}

type ReviewResultsProps = {
  results: ReviewResult[]
}

export function ReviewResults({ results }: ReviewResultsProps) {
  const [expandedReview, setExpandedReview] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Review Results</h2>
      {results.map((result) => (
        <Card key={result.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{result.company}</span>
              <Button
                onClick={() => setExpandedReview(expandedReview === result.id ? null : result.id)}
                variant="outline"
              >
                {expandedReview === result.id ? 'Collapse' : 'Expand'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expandedReview === result.id && (
              <Accordion type="single" collapsible className="w-full">
                {result.clauses.map((clause, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{clause.name}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-2">
                        {clause.quotes.map((quote, quoteIndex) => (
                          <li key={quoteIndex} className="text-sm text-gray-600">
                            {quote}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}