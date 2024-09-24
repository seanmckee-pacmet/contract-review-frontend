import { Checkbox } from "@/components/ui/checkbox"

type FileSelectionProps = {
  onSelect: (files: string[]) => void
  selectedFiles: string[]
}

export function FileSelection({ onSelect, selectedFiles }: FileSelectionProps) {
  const handleFileSelect = (file: string) => {
    const updatedFiles = selectedFiles.includes(file)
      ? selectedFiles.filter(f => f !== file)
      : [...selectedFiles, file]
    onSelect(updatedFiles)
  }

  const files = ['Contract.pdf', 'Agreement.docx', 'Terms.pdf'] // Example files

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Select Files for Review</h2>
      <div className="space-y-2">
        {files.map((file) => (
          <div key={file} className="flex items-center">
            <Checkbox
              id={file}
              checked={selectedFiles.includes(file)}
              onCheckedChange={() => handleFileSelect(file)}
            />
            <label htmlFor={file} className="ml-2 text-sm text-gray-600">
              {file}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}