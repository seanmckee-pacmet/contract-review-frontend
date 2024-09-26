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
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Review Criteria Group
      </label>
      <Select 
        onValueChange={(value) => {
          const selectedGroup = groups.find(g => g.id === value);
          if (selectedGroup) {
            onSelectGroup(selectedGroup);
          }
        }} 
        value={currentGroup?.id || ""}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a review criteria group" />
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