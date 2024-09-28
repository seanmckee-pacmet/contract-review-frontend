"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Upload, Plus, Clipboard } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Link from "next/link"

// Define types for our data structures
type Document = {
  id: string;
  company_id: string;
  doc_type: string;
  name: string;
};

type Company = {
  id: string;  // Changed from number to string based on the example
  name: string;
};

type Documents = {
  [company: string]: Document[];
};

const API_BASE_URL = "http://localhost:8000/documents"  

export default function DocumentManagement() {
  const [selectedCompany, setSelectedCompany] = useState("")
  const [newCompanyName, setNewCompanyName] = useState("")
  const [companies, setCompanies] = useState<Company[]>([])
  const [documents, setDocuments] = useState<Documents>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (selectedCompany) {
      fetchDocuments(selectedCompany)
      console.log("documents", documents)
    }
  }, [selectedCompany])

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/companies`)
      // Extract the data array from the response
      const companiesData = response.data.data || []
      setCompanies(companiesData)
    } catch (error) {
      console.error("Error fetching companies:", error)
      setError("Failed to fetch companies")
      setCompanies([])
    }
  }

  // maybe pass companyID instead of companyName
  const fetchDocuments = async (companyName: string) => {
    try {
      const company = companies.find(company => company.name === companyName);
      if (!company) {
        throw new Error("Company not found");
      }
      const response = await axios.get(`${API_BASE_URL}/${company.id}`);
      console.log("response", response.data);
      setDocuments(prevDocuments => ({
        ...prevDocuments,
        [companyName]: response.data.data
      }));
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to fetch documents");
    }
  }

  const handleCompanyCreate = async () => {
    if (newCompanyName && (!companies || !companies.some(company => company.name === newCompanyName))) {
      try {
        const response = await axios.post(`${API_BASE_URL}/company`, null, {
          params: { company_name: newCompanyName }
        })
        fetchCompanies()
        setNewCompanyName("")
        setNewCompanyName("")
        setError("")
      } catch (error) {
        console.error("Error creating company:", error)
        setError("Failed to create company")
      }
    } else {
      setError("Company name is empty or already exists")
    }
  }

  const handleCompanyDelete = async (companyId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/company/${companyId}`)
      setCompanies(companies.filter(company => company.id !== companyId))
      const companyName = companies.find(company => company.id === companyId)?.name
      if (companyName) {
        const { [companyName]: _, ...remainingDocuments } = documents
        setDocuments(remainingDocuments)
        if (selectedCompany === companyName) {
          setSelectedCompany("")
        }
      }
    } catch (error) {
      console.error("Error deleting company:", error)
      setError("Failed to delete company")
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedCompany) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const company = companies.find(c => c.name === selectedCompany);
        if (!company) {
          throw new Error("Selected company not found");
        }

        const response = await axios.post(
          `${API_BASE_URL}/upload/${company.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Assuming the response includes the new document data
        const newDocument: Document = {
          id: response.data.id, // Make sure this is included in the response
          name: response.data.name,
          doc_type: response.data.doc_type,
          company_id: company.id
        };

        setDocuments(prevDocuments => ({
          ...prevDocuments,
          [selectedCompany]: [...(prevDocuments[selectedCompany] || []), newDocument]
        }));

        setError("");
      } catch (error) {
        console.error("Error uploading document:", error);
        setError("Failed to upload document");
      } finally {
        setIsLoading(false);
        fetchDocuments(selectedCompany);
      }
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/document/${docId}`)
      setDocuments(prevDocuments => ({
        ...prevDocuments,
        [selectedCompany]: prevDocuments[selectedCompany].filter(doc => doc.id !== String(docId))
      }))
    } catch (error) {
      console.error("Error deleting document:", error)
      setError("Failed to delete document")
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
          <CardDescription>Manage you supporting documents such as Quality Documents and Terms and Conditions</CardDescription>
          <CardDescription> (upload your purchase order when creating a new review).</CardDescription>
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
                    <SelectItem key={company.id} value={company.name}>
                      {company.name}
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
                      <AlertDialogAction onClick={() => {
                        const company = companies.find(c => c.name === selectedCompany)
                        if (company) {
                          handleCompanyDelete(company.id)
                        }
                      }}>Delete</AlertDialogAction>
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
              <Label htmlFor="file-upload">Upload PDF Document for {selectedCompany}</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  accept=".pdf, .tif, .tiff"
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
                  <TableHead>Document Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents[selectedCompany].map((doc: Document, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.doc_type}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Link href={`/manual-onboarding/${doc.id}`} passHref>
                          <Button variant="outline" size="sm">
                            <Clipboard className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
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