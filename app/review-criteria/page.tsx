"use client"

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CriteriaGroupDropdown from './components/CriteriaGroupDropdown'
import GroupClauses from './components/GroupClauses'
import ManageClauses from './components/ManageClauses'
import { CriteriaGroup, Clause } from './types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const API_BASE_URL = "http://localhost:8000/review_criteria"  // Adjust this to match your backend URL

export default function ReviewCriteriaManager() {
  const [criteriaGroups, setCriteriaGroups] = useState<CriteriaGroup[]>([])
  const [allClauses, setAllClauses] = useState<Clause[]>([])
  const [selectedGroup, setSelectedGroup] = useState<CriteriaGroup | null>(null)
  const [newGroup, setNewGroup] = useState<CriteriaGroup>({ id: '', name: '', clauses: [] })
  const [newClause, setNewClause] = useState<Clause>({ id: '', name: '', description: '' })
  const [isCreatingNewGroup, setIsCreatingNewGroup] = useState(false)
  const [isAddingNewClause, setIsAddingNewClause] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState<CriteriaGroup | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [clauses, setClauses] = useState<Clause[]>([])
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null)
  const [isEditingClause, setIsEditingClause] = useState(false)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)

  useEffect(() => {
    fetchAllCriteriaGroupsAndClauses()
    fetchAllClauses()
  }, [])

  const fetchAllCriteriaGroupsAndClauses = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/criteria_groups/all`)
      console.log('Fetched all criteria groups and clauses:', response.data.criteria_groups)
      setCriteriaGroups(response.data.criteria_groups || [])
    } catch (error) {
      console.error('Error fetching all criteria groups and clauses:', error)
      setCriteriaGroups([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllClauses = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/clauses`)
      console.log('Fetched all clauses:', response.data.clauses)
      setAllClauses(response.data.clauses || [])
      setClauses(response.data.clauses || [])  // Set clauses for management
    } catch (error) {
      console.error('Error fetching all clauses:', error)
      setAllClauses([])
      setClauses([])
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleAddGroup = async () => {
    if (newGroup.name) {
      try {
        const response = await axios.post(`${API_BASE_URL}/criteria_groups`, null, { params: { name: newGroup.name } })
        const createdGroup = response.data.criteria_group
        setCriteriaGroups([...criteriaGroups, createdGroup])
        setSelectedGroup(createdGroup)
        setIsCreatingNewGroup(false)
        setNewGroup({ id: '', name: '', clauses: [] })
      } catch (error) {
        console.error('Error creating new group:', error)
      }
    }
  }

  const handleAddNewClause = async () => {
    if (newClause.name && newClause.description) {
      try {
        const response = await axios.post(`${API_BASE_URL}/criteria_groups/${selectedGroup?.id}/clauses`, null, {
          params: {
            name: newClause.name,
            description: newClause.description,
          }
        })
        const clause = response.data.clause
        
        // Update the clauses and allClauses states
        setClauses(prevClauses => [...prevClauses, clause])
        setAllClauses(prevAllClauses => [...prevAllClauses, clause])
  
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
      } catch (error) {
        console.error('Error adding new clause:', error)
      }
    }
  }

  const handleDeleteClause = async (clauseId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/clauses/${clauseId}`)
      // Remove clause from clauses state
      setClauses(prevClauses => prevClauses.filter(c => c.id !== clauseId))
      // Remove clause from allClauses if needed
      setAllClauses(prevAllClauses => prevAllClauses.filter(c => c.id !== clauseId))
      // Update clauses in criteriaGroups
      setCriteriaGroups(prevGroups => prevGroups.map(group => ({
        ...group,
        clauses: group.clauses.filter(c => c.id !== clauseId)
      })))
      // Update selectedGroup if necessary
      if (selectedGroup) {
        setSelectedGroup(prevGroup => ({
          ...prevGroup!,
          clauses: prevGroup!.clauses.filter(c => c.id !== clauseId)
        }))
      }
      // Update newGroup if creating a new group
      if (isCreatingNewGroup) {
        setNewGroup(prevNewGroup => ({
          ...prevNewGroup,
          clauses: prevNewGroup.clauses.filter(c => c.id !== clauseId)
        }))
      }
    } catch (error) {
      console.error('Error deleting clause:', error)
      // Optionally handle the error state here
    }
  }

  const handleExistingClauseSelection = async (clauseId: string) => {
    const clause = allClauses.find(c => c.id === clauseId)
    if (clause) {
      if (selectedGroup) {
        try {
          await axios.post(`${API_BASE_URL}/criteria_groups/${selectedGroup.id}/clauses/${clause.id}`)
          const updatedGroups = criteriaGroups.map(g => 
            g.id === selectedGroup.id 
              ? { ...g, clauses: [...(g.clauses || []), clause] }
              : g
          )
          setCriteriaGroups(updatedGroups)
          setSelectedGroup({
            ...selectedGroup,
            clauses: [...(selectedGroup.clauses || []), clause]
          })
        } catch (error) {
          console.error('Error adding existing clause:', error)
        }
      } else if (isCreatingNewGroup) {
        setNewGroup({
          ...newGroup,
          clauses: [...(newGroup.clauses || []), clause]
        })
      }
    }
  }

  const handleDeleteGroup = async () => {
    if (groupToDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/criteria_groups/${groupToDelete.id}`)
        setCriteriaGroups(prevGroups => prevGroups.filter(g => g.id !== groupToDelete.id))
        if (selectedGroup && selectedGroup.id === groupToDelete.id) {
          setSelectedGroup(null)
        }
        setGroupToDelete(null)
      } catch (error) {
        console.error('Error deleting group:', error)
        // Optionally handle the error state here
      }
    }
  }

  const handleEditClause = (clause: Clause) => {
    setSelectedClause(clause)
    setIsEditingClause(true)
  }

  const handleSaveEditedClause = async () => {
    if (selectedClause) {
      try {
        await axios.put(`${API_BASE_URL}/clauses/${selectedClause.id}`, null, {
          params: {
            name: selectedClause.name,
            description: selectedClause.description,
          },
        })
        // Update clauses state
        setClauses(
          clauses.map((c) =>
            c.id === selectedClause.id ? selectedClause : c
          )
        )
        // Update clauses in criteriaGroups
        setCriteriaGroups(
          criteriaGroups.map((group) => ({
            ...group,
            clauses: group.clauses.map((c) =>
              c.id === selectedClause.id ? selectedClause : c
            ),
          }))
        )
        // Update selectedGroup if necessary
        if (selectedGroup) {
          setSelectedGroup({
            ...selectedGroup,
            clauses: selectedGroup.clauses.map((c) =>
              c.id === selectedClause.id ? selectedClause : c
            ),
          })
        }
        setIsEditingClause(false)
        setSelectedClause(null)
      } catch (error) {
        console.error('Error updating clause:', error)
      }
    }
  }

  const handleRemoveClauseFromGroup = async (clauseId: string) => {
    if (selectedGroup) {
      try {
        await axios.delete(`${API_BASE_URL}/criteria_groups/${selectedGroup.id}/clauses/${clauseId}`)
        setSelectedGroup(prevGroup => ({
          ...prevGroup!,
          clauses: prevGroup!.clauses.filter(c => c.id !== clauseId)
        }))
      } catch (error) {
        console.error('Error removing clause from group:', error)
      }
    }
  }

  // Add this new function to filter out existing clauses
  const getAvailableClauses = () => {
    if (selectedGroup && selectedGroup.clauses) {
      return allClauses.filter(clause => !selectedGroup.clauses.some(existingClause => existingClause.id === clause.id));
    } else if (isCreatingNewGroup && newGroup.clauses) {
      return allClauses.filter(clause => !newGroup.clauses.some(existingClause => existingClause.id === clause.id));
    }
    return allClauses;
  };


  const handleGenerateDescription = async () => {
    if (newClause.name) {
      setIsGeneratingDescription(true)
      try {
        const response = await axios.post(`${API_BASE_URL}/clauses/generate_description`, null, {
          params: { name: newClause.name }
        })
        setNewClause(prevClause => ({
          ...prevClause,
          description: response.data.description
        }))
      } catch (error) {
        console.error('Error generating description:', error)
      } finally {
        setIsGeneratingDescription(false)
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Review Criteria Manager</h1>
      
      <CriteriaGroupDropdown
        criteriaGroups={criteriaGroups}
        selectedGroup={selectedGroup}
        handleSelectGroup={handleSelectGroup}
        handleCreateNewGroup={handleCreateNewGroup}
        handleDeleteGroup={handleDeleteGroup}
        setGroupToDelete={setGroupToDelete}
        groupToDelete={groupToDelete}
      />

      {isCreatingNewGroup && (
        <div className="mb-6 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
          <Input
            placeholder="Group Name"
            value={newGroup.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGroup({ ...newGroup, name: e.target.value })}
            className="mb-4"
          />
          <Button onClick={handleAddGroup}>Create Group</Button>
        </div>
      )}

      {(selectedGroup || isCreatingNewGroup) && (
        <GroupClauses
          isCreatingNewGroup={isCreatingNewGroup}
          selectedGroup={selectedGroup}
          newGroup={newGroup}
          newClause={newClause}
          allClauses={getAvailableClauses()} // Use the filtered clauses here
          isAddingNewClause={isAddingNewClause}
          setNewGroup={setNewGroup}
          setNewClause={setNewClause}
          setIsAddingNewClause={setIsAddingNewClause}
          handleAddNewClause={handleAddNewClause}
          handleExistingClauseSelection={handleExistingClauseSelection}
          handleRemoveClauseFromGroup={handleRemoveClauseFromGroup}
          handleGenerateDescription={handleGenerateDescription}
          isGeneratingDescription={isGeneratingDescription}
        />
      )}

      <ManageClauses
        clauses={clauses}
        handleEditClause={handleEditClause}
        handleDeleteClause={handleDeleteClause}
        isEditingClause={isEditingClause}
        selectedClause={selectedClause}
        setSelectedClause={setSelectedClause}
        setIsEditingClause={setIsEditingClause}
        handleSaveEditedClause={handleSaveEditedClause}
      />
    </div>
  )
}