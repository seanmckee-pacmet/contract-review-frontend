import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CompanySelectProps = {
  onSelect: (company: string) => void
  value: string
}

export function CompanySelect({ onSelect, value }: CompanySelectProps) {
  return (
    <div className="mb-6">
      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
        Select Company
      </label>
      <Select onValueChange={onSelect} value={value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a company" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="company1">Company 1</SelectItem>
          <SelectItem value="company2">Company 2</SelectItem>
          <SelectItem value="company3">Company 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}