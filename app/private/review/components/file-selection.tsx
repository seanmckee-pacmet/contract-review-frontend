import { Checkbox } from "@/components/ui/checkbox"

type File = {
  id: string
  name: string
}

type FileSelectionProps = {
  onSelect: (files: string[]) => void
  selectedFiles: string[]
  availableFiles: File[]
}

export function FileSelection({ onSelect, selectedFiles, availableFiles }: FileSelectionProps) {
  const handleFileSelect = (fileId: string) => {
    const updatedFiles = selectedFiles.includes(fileId)
      ? selectedFiles.filter(f => f !== fileId)
      : [...selectedFiles, fileId]
    onSelect(updatedFiles)
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Select Files for Review</h2>
      <div className="space-y-2">
        {availableFiles.map((file) => (
          <div key={file.id} className="flex items-center">
            <Checkbox
              id={file.id}
              checked={selectedFiles.includes(file.id)}
              onCheckedChange={() => handleFileSelect(file.id)}
            />
            <label htmlFor={file.id} className="ml-2 text-sm text-gray-600">
              {file.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}