import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Clause = {
  id: string
  name: string
  description: string
}

type ReviewCriteriaGroup = {
  id: string
  name: string
  clauses: Clause[]
}

type ReviewTypeSelectionProps = {
  onSelectGroup: (group: ReviewCriteriaGroup) => void
  currentGroup: ReviewCriteriaGroup | null
  groups: ReviewCriteriaGroup[]
}

export function ReviewTypeSelection({ onSelectGroup, currentGroup, groups }: ReviewTypeSelectionProps) {
  const handleSelectChange = (value: string) => {
    const selectedGroup = groups.find(group => group.id === value)
    if (selectedGroup) {
      onSelectGroup(selectedGroup)
    }
  }

  return (
    <div className="w-full max-w-xs">
      <Select onValueChange={handleSelectChange} value={currentGroup?.id || ""}>
        <SelectTrigger>
          <SelectValue placeholder="Select a review type" />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}