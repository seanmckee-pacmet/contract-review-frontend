"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const API_BASE_URL = "http://localhost:8000/documents"

type Chunk = {
  id: string;
  document_id: string;
  content: string;
  header?: string;
};

export default function ManualOnboarding() {
  const params = useParams()
  const [chunks, setChunks] = useState<Chunk[]>([])
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchChunks()
  }, [])

  const fetchChunks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${params.id}/chunks`)
      setChunks(response.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching chunks:", error)
      setError("Failed to fetch document chunks")
      setLoading(false)
    }
  }

  const handleHeaderUpdate = async (chunkId: string, header: string) => {
    try {
      await axios.put(`${API_BASE_URL}/chunk/${chunkId}`, { header })
      setError("")
    } catch (error) {
      console.error("Error updating chunk header:", error)
      setError("Failed to update chunk header")
    }
  }

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" && currentChunkIndex > 0) {
      setCurrentChunkIndex(prevIndex => prevIndex - 1)
    } else if (event.key === "ArrowRight" && currentChunkIndex < chunks.length - 1) {
      setCurrentChunkIndex(prevIndex => prevIndex + 1)
    }
  }, [currentChunkIndex, chunks.length])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (chunks.length === 0) return <div>No chunks found</div>

  const currentChunk = chunks[currentChunkIndex]

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Manual Onboarding: Document Chunks</CardTitle>
          <CardDescription className="text-lg text-gray-700">Edit document chunk headers (Use arrow keys to navigate)</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`header-${currentChunk.id}`} className="text-lg font-semibold text-gray-800">Header</Label>
            <Input
              id={`header-${currentChunk.id}`}
              value={currentChunk.header || ""}
              onChange={(e) => {
                const updatedChunks = chunks.map((c, index) =>
                  index === currentChunkIndex ? { ...c, header: e.target.value } : c
                )
                setChunks(updatedChunks)
              }}
              className="text-gray-900"
            />
          </div>
          <div className="space-y-2 flex-grow flex flex-col">
            <Label htmlFor={`content-${currentChunk.id}`} className="text-lg font-semibold text-gray-800">Chunk Content</Label>
            <Textarea
              id={`content-${currentChunk.id}`}
              value={currentChunk.content}
              disabled
              className="flex-grow text-gray-900 text-base"
            />
          </div>
          <Button onClick={() => handleHeaderUpdate(currentChunk.id, currentChunk.header || "")} className="w-full">
            Update Header
          </Button>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setCurrentChunkIndex(prevIndex => Math.max(0, prevIndex - 1))}
              disabled={currentChunkIndex === 0}
            >
              Previous
            </Button>
            <span className="text-lg font-semibold text-gray-800">{currentChunkIndex + 1} / {chunks.length}</span>
            <Button
              onClick={() => setCurrentChunkIndex(prevIndex => Math.min(chunks.length - 1, prevIndex + 1))}
              disabled={currentChunkIndex === chunks.length - 1}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}