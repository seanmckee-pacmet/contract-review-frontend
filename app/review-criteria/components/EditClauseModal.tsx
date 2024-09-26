import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Clause } from '../types'

interface EditClauseModalProps {
  selectedClause: Clause
  setSelectedClause: (clause: Clause | null) => void  // Update this line
  handleSaveEditedClause: () => void
  setIsEditingClause: (isEditing: boolean) => void
}

const EditClauseModal: React.FC<EditClauseModalProps> = ({
  selectedClause,
  setSelectedClause,
  handleSaveEditedClause,
  setIsEditingClause
}) => {
  return (
    <div className="mt-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Edit Clause</h3>
      <Input
        placeholder="Clause Name"
        value={selectedClause.name}
        onChange={(e) =>
          setSelectedClause({ ...selectedClause, name: e.target.value })
        }
        className="mb-2"
      />
      <Textarea
        placeholder="Clause Description"
        value={selectedClause.description}
        onChange={(e) =>
          setSelectedClause({
            ...selectedClause,
            description: e.target.value,
          })
        }
        className="mb-2"
      />
      <div className="space-x-2">
        <Button onClick={handleSaveEditedClause}>Save Changes</Button>
        <Button
          variant="secondary"
          onClick={() => {
            setIsEditingClause(false)
            setSelectedClause(null)  // This is now valid
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default EditClauseModal