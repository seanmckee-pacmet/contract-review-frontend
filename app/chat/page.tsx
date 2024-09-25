"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"

type Company = {
  id: string
  name: string
}

type Document = {
  id: string
  name: string
  content: string
}

const API_BASE_URL = "http://localhost:8000/documents"
const API_CHAT_URL = "http://localhost:8000/chat"

export default function DocumentChatPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [documents, setDocuments] = useState<Record<string, Document[]>>({})
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([])
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (selectedCompany) {
      fetchDocuments(selectedCompany.id)
    }
  }, [selectedCompany])

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/companies`)
      setCompanies(response.data.data || [])
    } catch (error) {
      console.error("Error fetching companies:", error)
    }
  }

  const fetchDocuments = async (companyId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${companyId}`)
      setDocuments(prevDocuments => ({
        ...prevDocuments,
        [companyId]: response.data.data
      }))
    } catch (error) {
      console.error("Error fetching documents:", error)
    }
  }

  const handleCompanySelect = (companyId: string) => {
    const company = companies.find(c => c.id === companyId) || null
    setSelectedCompany(company)
    setSelectedDocuments([])
  }

  const handleDocumentToggle = (document: Document) => {
    setSelectedDocuments(prev => 
      prev.some(d => d.id === document.id)
        ? prev.filter(d => d.id !== document.id)
        : [...prev, document]
    )
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedDocuments.length) return

    const newUserMessage = { role: 'user' as const, content: inputMessage }
    setChatHistory(prev => [...prev, newUserMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await axios.post(API_CHAT_URL, null, {
        params: {
          query: inputMessage,
          document_ids: selectedDocuments.map(doc => doc.id).join(',')
        }
      })
      
      if (response.data && response.data.message) {
        const aiResponse = { role: 'ai' as const, content: response.data.message }
        setChatHistory(prev => [...prev, aiResponse])
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error("Error processing chat message:", error)
      const errorMessage = { role: 'ai' as const, content: "Sorry, I encountered an error while processing your message." }
      setChatHistory(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Document Chat</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-1">
            <CardHeader>
              <CardTitle>Select Company and Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <Select onValueChange={handleCompanySelect}>
                    <SelectTrigger id="company" className="w-full">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedCompany && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Select Documents</h3>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      <div className="space-y-2">
                        {documents[selectedCompany.id]?.map((document) => (
                          <div key={document.id} className="flex items-start space-x-2">
                            <Checkbox
                              id={document.id}
                              checked={selectedDocuments.some(d => d.id === document.id)}
                              onCheckedChange={() => handleDocumentToggle(document)}
                              className="mt-1"
                            />
                            <label
                              htmlFor={document.id}
                              className="text-sm leading-tight cursor-pointer"
                            >
                              {document.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4 mb-4">
                <div className="space-y-4">
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage()
                    }
                  }}
                  className="flex-grow"
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !selectedDocuments.length}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}