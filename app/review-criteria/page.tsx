"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash, ChevronDown, Search } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Clause {
  id: string
  name: string
  description: string
}

interface CriteriaGroup {
  id: string
  name: string
  clauses: Clause[]
}

// Dummy data for existing clauses
const existingClauses: Clause[] = [
  { id: '1', name: 'Indemnification', description: 'Look for indemnification clauses' },
  { id: '2', name: 'Termination', description: 'Check for termination conditions' },
  { id: '3', name: 'Payment Schedule', description: 'Identify payment schedules' },
  { id: '4', name: 'Late Fees', description: 'Look for late fee clauses' },
  { id: '5', name: 'Confidentiality', description: 'Identify confidentiality agreements' },
  { id: '6', name: 'Intellectual Property', description: 'Check for IP ownership and rights' },
  { id: '7', name: 'Force Majeure', description: 'Identify force majeure clauses' },
  { id: '8', name: 'Dispute Resolution', description: 'Look for dispute resolution mechanisms' },
  { id: '9', name: 'Warranty', description: 'Identify warranty terms and conditions' },
  { id: '10', name: 'Limitation of Liability', description: 'Check for liability limitations' },
]

export default function ReviewCriteriaManager() {
  const [criteriaGroups, setCriteriaGroups] = useState<CriteriaGroup[]>([
    {
      id: '1',
      name: 'General Terms',
      clauses: [existingClauses[0], existingClauses[1]],
    },
    {
      id: '2',
      name: 'Payment Terms',
      clauses: [existingClauses[2], existingClauses[3]],
    },
  ])

  const [selectedGroup, setSelectedGroup] = useState<CriteriaGroup | null>(null)
  const [newGroup, setNewGroup] = useState<CriteriaGroup>({ id: '', name: '', clauses: [] })
  const [newClause, setNewClause] = useState<Clause>({ id: '', name: '', description: '' })
  const [isCreatingNewGroup, setIsCreatingNewGroup] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Clause[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAddingNewClause, setIsAddingNewClause] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState<CriteriaGroup | null>(null)

  useEffect(() => {
    if (searchTerm) {
      const results = existingClauses.filter(clause =>
        clause.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clause.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  const handleSelectGroup = (groupId: string) => {
    const group = criteriaGroups.find(g => g.id === groupId)
    setSelectedGroup(group || null)
    setIsCreatingNewGroup(false)
  }

  const handleCreateNewGroup = () => {
    setIsCreatingNewGroup(true)
    setSelectedGroup(null)
    setNewGroup({ id: '', name: '', clauses: [] })
  }

  const handleAddGroup = () => {
    if (newGroup.name) {
      const createdGroup = { ...newGroup, id: Date.now().toString() }
      setCriteriaGroups([...criteriaGroups, createdGroup])
      setSelectedGroup(createdGroup)
      setIsCreatingNewGroup(false)
      setNewGroup({ id: '', name: '', clauses: [] })
    }
  }

  const handleAddNewClause = () => {
    if (newClause.name && newClause.description) {
      const clause = { ...newClause, id: Date.now().toString() }
      if (isCreatingNewGroup) {
        setNewGroup({
          ...newGroup,
          clauses: [...newGroup.clauses, clause]
        })
      } else if (selectedGroup) {
        const updatedGroups = criteriaGroups.map(g => 
          g.id === selectedGroup.id 
            ? { ...g, clauses: [...g.clauses, clause] }
            : g
        )
        setCriteriaGroups(updatedGroups)
        setSelectedGroup({
          ...selectedGroup,
          clauses: [...selectedGroup.clauses, clause]
        })
      }
      setNewClause({ id: '', name: '', description: '' })
      setIsAddingNewClause(false)
    }
  }

  const handleDeleteClause = (clauseId: string) => {
    if (isCreatingNewGroup) {
      setNewGroup({
        ...newGroup,
        clauses: newGroup.clauses.filter(c => c.id !== clauseId)
      })
    } else if (selectedGroup) {
      const updatedGroups = criteriaGroups.map(g => 
        g.id === selectedGroup.id 
          ? { ...g, clauses: g.clauses.filter(c => c.id !== clauseId) }
          : g
      )
      setCriteriaGroups(updatedGroups)
      setSelectedGroup({
        ...selectedGroup,
        clauses: selectedGroup.clauses.filter(c => c.id !== clauseId)
      })
    }
  }

  const handleExistingClauseSelection = (clause: Clause) => {
    if (selectedGroup) {
      const updatedGroups = criteriaGroups.map(g => 
        g.id === selectedGroup.id 
          ? { ...g, clauses: [...g.clauses, clause] }
          : g
      )
      setCriteriaGroups(updatedGroups)
      setSelectedGroup({
        ...selectedGroup,
        clauses: [...selectedGroup.clauses, clause]
      })
    } else if (isCreatingNewGroup) {
      setNewGroup({
        ...newGroup,
        clauses: [...newGroup.clauses, clause]
      })
    }
    setIsSearchOpen(false)
    setSearchTerm('')
  }

  const handleDeleteGroup = () => {
    if (groupToDelete) {
      const updatedGroups = criteriaGroups.filter(g => g.id !== groupToDelete.id)
      setCriteriaGroups(updatedGroups)
      if (selectedGroup && selectedGroup.id === groupToDelete.id) {
        setSelectedGroup(null)
      }
      setGroupToDelete(null)
    }
  }

  const renderClauses = (clauses: Clause[]) => {
    return clauses.map((clause) => (
      <TableRow key={clause.id}>
        <TableCell>{clause.name}</TableCell>
        <TableCell>{clause.description}</TableCell>
        <TableCell>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteClause(clause.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Review Criteria Manager</h1>
      
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
            {criteriaGroups.map((group) => (
              <DropdownMenuItem key={group.id} onSelect={() => handleSelectGroup(group.id)}>
                {group.name}
              </DropdownMenuItem>
            ))}
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

      {isCreatingNewGroup && (
        <div className="mb-6 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
          <Input
            placeholder="Group Name"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            className="mb-4"
          />
          <Button onClick={handleAddGroup}>Create Group</Button>
        </div>
      )}

      {(selectedGroup || isCreatingNewGroup) && (
        <div className="mb-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            {isCreatingNewGroup ? "New Group Clauses" : `${selectedGroup?.name} Clauses`}
          </h2>

          <div className="flex space-x-4 mb-4">
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline">Add Existing Clause</Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search clauses..." 
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandEmpty>No clauses found.</CommandEmpty>
                  <CommandGroup>
                    {searchResults.map((clause) => (
                      <CommandItem
                        key={clause.id}
                        onSelect={() => handleExistingClauseSelection(clause)}
                      >
                        {clause.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <Button onClick={() => setIsAddingNewClause(true)}>Add New Clause</Button>
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
              <Input
                placeholder="New Clause Name"
                value={newClause.name}
                onChange={(e) => setNewClause({ ...newClause, name: e.target.value })}
                className="mb-2"
              />
              <Textarea
                placeholder="New Clause Description"
                value={newClause.description}
                onChange={(e) => setNewClause({ ...newClause, description: e.target.value })}
                className="mb-2"
              />
              <Button onClick={handleAddNewClause}>Add New Clause</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}