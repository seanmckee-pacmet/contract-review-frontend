import React from 'react'
import { Button } from "@/components/ui/button"
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { CriteriaGroup } from '../types'

interface CriteriaGroupDropdownProps {
  criteriaGroups: CriteriaGroup[]
  selectedGroup: CriteriaGroup | null
  handleSelectGroup: (groupId: string) => void
  handleCreateNewGroup: () => void
  handleDeleteGroup: () => void
  setGroupToDelete: (group: CriteriaGroup | null) => void
  groupToDelete: CriteriaGroup | null
}

const CriteriaGroupDropdown: React.FC<CriteriaGroupDropdownProps> = ({
  criteriaGroups,
  selectedGroup,
  handleSelectGroup,
  handleCreateNewGroup,
  handleDeleteGroup,
  setGroupToDelete,
  groupToDelete
}) => {
  return (
    <div className="flex space-x-4 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {selectedGroup ? selectedGroup.name : "Select Group"} <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Existing Groups</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {criteriaGroups.length > 0 ? (
            criteriaGroups.map((group) => (
              <DropdownMenuItem key={group.id} onSelect={() => handleSelectGroup(group.id)}>
                {group.name}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No groups available</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button onClick={handleCreateNewGroup}>Create New Group</Button>

      {selectedGroup && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" onClick={() => setGroupToDelete(selectedGroup)}>
              Delete Group
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                "{selectedGroup.name}" group and all its clauses.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setGroupToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteGroup}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}

export default CriteriaGroupDropdown