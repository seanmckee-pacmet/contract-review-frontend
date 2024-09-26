import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Wand2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { X } from 'lucide-react'
import { CriteriaGroup, Clause } from '../types'

interface GroupClausesProps {
  isCreatingNewGroup: boolean
  selectedGroup: CriteriaGroup | null
  newGroup: CriteriaGroup
  newClause: Clause
  allClauses: Clause[]
  isAddingNewClause: boolean
  setNewGroup: (group: CriteriaGroup) => void
  setNewClause: (clause: Clause) => void
  setIsAddingNewClause: (isAdding: boolean) => void
  handleAddNewClause: () => void
  handleExistingClauseSelection: (clauseId: string) => void
  handleRemoveClauseFromGroup: (clauseId: string) => void
  handleGenerateDescription: () => Promise<void>
  isGeneratingDescription: boolean
}

const GroupClauses: React.FC<GroupClausesProps> = ({
  isCreatingNewGroup,
  selectedGroup,
  newGroup,
  newClause,
  allClauses,
  isAddingNewClause,
  setNewGroup,
  setNewClause,
  setIsAddingNewClause,
  handleAddNewClause,
  handleExistingClauseSelection,
  handleRemoveClauseFromGroup,
  handleGenerateDescription,
  isGeneratingDescription,
}) => {
  const renderClauses = (clauses: Clause[]) => {
    if (!clauses) {
      return null;
    }
    return clauses.map((clause) => (
      <TableRow key={clause.id}>
        <TableCell>{clause.name}</TableCell>
        <TableCell>{clause.description}</TableCell>
        <TableCell>
          <Button variant="outline" size="sm" onClick={() => handleRemoveClauseFromGroup(clause.id)}>
            <X className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ))
  }

  return (
    <div className="mb-6 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        {isCreatingNewGroup ? `Clauses for New Group: ${newGroup.name}` : `Clauses for ${selectedGroup?.name}`}
      </h2>

      <div className="flex space-x-4 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Add Existing Clause</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Existing Clauses</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allClauses.length > 0 ? (
              allClauses.map((clause) => (
                <DropdownMenuItem key={clause.id} onSelect={() => handleExistingClauseSelection(clause.id)}>
                  {clause.name}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No clauses available</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={() => setIsAddingNewClause(!isAddingNewClause)}>
          {isAddingNewClause ? 'Cancel' : 'Add New Clause'}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Clause</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isCreatingNewGroup 
            ? renderClauses(newGroup.clauses)
            : selectedGroup && renderClauses(selectedGroup.clauses)}
        </TableBody>
      </Table>

      {isAddingNewClause && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Add New Clause</h3>
          <div className="flex mb-2 items-center">
            <Input
              placeholder="Clause Name"
              value={newClause.name}
              onChange={(e) => setNewClause({ ...newClause, name: e.target.value })}
              className="flex-grow mr-2"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleGenerateDescription}
                    disabled={!newClause.name || isGeneratingDescription}
                    className="whitespace-nowrap"
                  >
                    {isGeneratingDescription ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate Description</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            placeholder="Clause Description"
            value={newClause.description}
            onChange={(e) => setNewClause({ ...newClause, description: e.target.value })}
            className="w-full mb-2"
            rows={4}
          />
          <Button onClick={handleAddNewClause} disabled={!newClause.name || !newClause.description}>
            Add Clause
          </Button>
        </div>
      )}
    </div>
  )
}

export default GroupClauses