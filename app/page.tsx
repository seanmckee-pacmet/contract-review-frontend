"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Upload, Plus } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

// Define types for our data structures
type Document = {
  id: number;
  name: string;
  uploadDate: string;
};

type Documents = {
  [company: string]: Document[];
};

// Add this line to define mockCompanies
const mockCompanies = ["Company A", "Company B", "Company C"];

// Update mock data to match our new types
const mockDocuments: Documents = {
  "Company A": [
    { id: 1, name: "Contract 1.pdf", uploadDate: "2023-09-20" },
    { id: 2, name: "Agreement 2.docx", uploadDate: "2023-09-21" },
  ],
  "Company B": [
    { id: 3, name: "Proposal 1.pdf", uploadDate: "2023-09-22" },
  ],
  "Company C": [],
};

export default function DocumentManagement() {
  const [selectedCompany, setSelectedCompany] = useState("")
  const [newCompanyName, setNewCompanyName] = useState("")
  const [companies, setCompanies] = useState(mockCompanies)
  const [documents, setDocuments] = useState<Documents>(mockDocuments)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCompanyCreate = () => {
    if (newCompanyName && !companies.includes(newCompanyName)) {
      setCompanies([...companies, newCompanyName])
      setDocuments({ ...documents, [newCompanyName]: [] })
      setNewCompanyName("")
      setError("")
    } else {
      setError("Company name is empty or already exists")
    }
  }

  const handleCompanyDelete = (companyToDelete: string) => {
    setCompanies(companies.filter(company => company !== companyToDelete))
    const { [companyToDelete]: _, ...remainingDocuments } = documents
    setDocuments(remainingDocuments)
    if (selectedCompany === companyToDelete) {
      setSelectedCompany("")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedCompany) {
      setIsLoading(true)
      // Simulating file upload
      setTimeout(() => {
        const newDoc: Document = { id: Date.now(), name: file.name, uploadDate: new Date().toISOString().split('T')[0] };
        setDocuments(prevDocuments => ({
          ...prevDocuments,
          [selectedCompany]: [...(prevDocuments[selectedCompany] || []), newDoc]
        }));
        setIsLoading(false);
      }, 1000);
    }
  }

  const handleDeleteDocument = (docId: number) => {
    setDocuments(prevDocuments => ({
      ...prevDocuments,
      [selectedCompany]: prevDocuments[selectedCompany].filter(doc => doc.id !== docId)
    }));
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
          <CardDescription>Manage documents for contract review</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-select">Select Company</Label>
            <div className="flex items-center space-x-2">
              <Select onValueChange={setSelectedCompany} value={selectedCompany}>
                <SelectTrigger id="company-select" className="flex-grow">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCompany && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" aria-label="Delete selected company">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete {selectedCompany}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the company and all associated documents.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleCompanyDelete(selectedCompany)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          <div className="flex items-end space-x-2">
            <div className="flex-grow space-y-2">
              <Label htmlFor="new-company">Create New Company</Label>
              <Input
                id="new-company"
                placeholder="Enter company name"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
              />
            </div>
            <Button onClick={handleCompanyCreate}>
              <Plus className="mr-2 h-4 w-4" /> Create
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {selectedCompany && (
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload Document for {selectedCompany}</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                />
                <Button disabled={isLoading}>
                  <Upload className="mr-2 h-4 w-4" />
                  {isLoading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCompany && documents[selectedCompany] && documents[selectedCompany].length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documents for {selectedCompany}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents[selectedCompany].map((doc: Document) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}