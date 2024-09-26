import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Company = {
  id: string
  name: string
}

type CompanySelectProps = {
  onSelect: (company: string) => void
  value: string
  companies: Company[]
}

export function CompanySelect({ onSelect, value, companies }: CompanySelectProps) {
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
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}