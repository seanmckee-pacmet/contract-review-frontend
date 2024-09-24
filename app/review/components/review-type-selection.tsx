import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

type Clause = {
  id: string
  name: string
  description: string
}

type ReviewTypeSelectionProps = {
  onSelectType: (type: 'general' | 'custom') => void
  onCustomClausesChange: (clauses: Clause[]) => void
  currentType: 'general' | 'custom'
  currentClauses: Clause[]
}

const preExistingClauses: Clause[] = [
  { id: 'dfars', name: 'DFARS', description: 'Defense Federal Acquisition Regulation Supplement' },
  { id: 'shelf-life', name: 'Shelf Life', description: 'Product shelf life requirements' },
  { id: 'reach', name: 'REACH', description: 'Registration, Evaluation, Authorisation and Restriction of Chemicals' },
]

export function ReviewTypeSelection({ onSelectType, onCustomClausesChange, currentType, currentClauses }: ReviewTypeSelectionProps) {
  const handleTypeChange = (value: 'general' | 'custom') => {
    onSelectType(value)
  }

  const handleClauseToggle = (clause: Clause) => {
    const updatedClauses = currentClauses.some(c => c.id === clause.id)
      ? currentClauses.filter(c => c.id !== clause.id)
      : [...currentClauses, clause]
    onCustomClausesChange(updatedClauses)
  }

  const handleAddClause = (name: string, description: string) => {
    if (name.trim() && description.trim()) {
      const newClause: Clause = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
      }
      onCustomClausesChange([...currentClauses, newClause])
    }
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Review Type</h2>
      <RadioGroup onValueChange={handleTypeChange} value={currentType}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="general" id="general" />
          <Label htmlFor="general">General Review</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="custom" />
          <Label htmlFor="custom">Custom Review</Label>
        </div>
      </RadioGroup>

      {currentType === 'custom' && (
        <div className="mt-4">
          <h3 className="text-md font-medium text-gray-700 mb-2">Select Clauses</h3>
          <div className="space-y-2">
            {preExistingClauses.map((clause) => (
              <div key={clause.id} className="flex items-start">
                <Checkbox
                  id={clause.id}
                  checked={currentClauses.some(c => c.id === clause.id)}
                  onCheckedChange={() => handleClauseToggle(clause)}
                />
                <div className="ml-2">
                  <Label htmlFor={clause.id} className="font-medium">{clause.name}</Label>
                  <p className="text-sm text-gray-500">{clause.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-md font-medium text-gray-700 mt-4 mb-2">Add Custom Clause</h3>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Clause Name"
              onChange={(e) => {
                if (e.target.value && (e.target.nextElementSibling as HTMLTextAreaElement).value) {
                  handleAddClause(e.target.value, (e.target.nextElementSibling as HTMLTextAreaElement).value)
                  e.target.value = ''
                  ;(e.target.nextElementSibling as HTMLTextAreaElement).value = ''
                }
              }}
            />
            <Textarea
              placeholder="Clause Description"
              onChange={(e) => {
                if (e.target.value && (e.target.previousElementSibling as HTMLInputElement).value) {
                  handleAddClause((e.target.previousElementSibling as HTMLInputElement).value, e.target.value)
                  e.target.value = ''
                  ;(e.target.previousElementSibling as HTMLInputElement).value = ''
                }
              }}
            />
          </div>

          {currentClauses.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Selected Clauses</h3>
              <ul className="list-disc list-inside">
                {currentClauses.map((clause) => (
                  <li key={clause.id} className="text-sm text-gray-600">{clause.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}