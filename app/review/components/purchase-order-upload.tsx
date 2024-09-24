import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

type PurchaseOrderUploadProps = {
  onUpload: (file: File | null) => void
  currentFile: File | null
}

export function PurchaseOrderUpload({ onUpload }: PurchaseOrderUploadProps) {
  const [fileName, setFileName] = useState<string>('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file) {
      setFileName(file.name)
      onUpload(file)
    } else {
      setFileName('')
      onUpload(null)
    }
  }

  return (
    <div className="mb-6">
      <Label htmlFor="purchase-order" className="block text-sm font-medium text-gray-700 mb-2">
        Upload Purchase Order
      </Label>
      <div className="flex items-center space-x-2">
        <Input
          id="purchase-order"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="hidden"
        />
        <Button
          onClick={() => document.getElementById('purchase-order')?.click()}
          variant="outline"
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose File
        </Button>
        <span className="text-sm text-gray-500">
          {fileName || 'No file chosen'}
        </span>
      </div>
    </div>
  )
}