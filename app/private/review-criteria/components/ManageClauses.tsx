import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash, ChevronDown, ChevronUp } from 'lucide-react'
import { Clause } from '../types'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ManageClausesProps {
  clauses: Clause[]
  handleEditClause: (clause: Clause) => void
  handleDeleteClause: (clauseId: string) => void
  isEditingClause: boolean
  selectedClause: Clause | null
  setSelectedClause: (clause: Clause | null) => void
  setIsEditingClause: (isEditing: boolean) => void
  handleSaveEditedClause: () => void
}

const ManageClauses: React.FC<ManageClausesProps> = ({
  clauses,
  handleEditClause,
  handleDeleteClause,
  isEditingClause,
  selectedClause,
  setSelectedClause,
  setIsEditingClause,
  handleSaveEditedClause
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mb-8 border rounded-lg"
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full flex justify-between p-4">
          <h2 className="text-xl font-semibold">Manage All Clauses</h2>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Clause</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clauses.map((clause) => (
              <TableRow key={clause.id}>
                <TableCell>{clause.name}</TableCell>
                <TableCell>{clause.description}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClause(clause)}
                    className="mr-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClause(clause.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Editing Clause Modal */}
        {isEditingClause && selectedClause && (
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
                  setSelectedClause(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

export default ManageClauses