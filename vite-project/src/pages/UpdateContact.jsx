"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import DashboardLayout from "../components/Layout/DashboardLayout"
import ContactForm from "../components/Contacts/ContactForm"
import { getContactById, updateContact } from "../services/api"
import { useAuth } from "../context/AuthContext"

export default function UpdateContact() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/contacts")
      return
    }

    const fetchContact = async () => {
      try {
        const response = await getContactById(id)
        setContact(response.data)
      } catch (error) {
        console.error("Error fetching contact:", error)
        setError("Failed to load contact")
        navigate("/contacts")
      } finally {
        setLoading(false)
      }
    }

    fetchContact()
  }, [id, navigate, isAdmin])

  const handleSubmit = async (formData) => {
    try {
      // Create FormData for multipart upload
      const data = new FormData()
      data.append("name", formData.name)
      data.append("email", formData.email)
      data.append("phone", formData.phone)
      data.append("company", formData.company)
      data.append("title", formData.jobTitle)
      data.append("category", formData.type)

      // Handle image file if present
      if (formData.imageFile) {
        data.append("image", formData.imageFile)
      }

      await updateContact(id, data)
      navigate("/contacts")
    } catch (error) {
      console.error("Error updating contact:", error)
      setError(error.response?.data?.message || "Failed to update contact")
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-400">Loading contact...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/contacts")}
            className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all"
          >
            Back to Contacts
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/contacts")} className="p-2 hover:bg-white/10 rounded-lg transition-all">
            <ArrowLeft size={24} className="text-slate-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Contact</h1>
            <p className="text-slate-400 mt-1">Update contact information</p>
          </div>
        </div>

        {/* Form Card */}
        {contact && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <ContactForm initialData={contact} onSubmit={handleSubmit} onCancel={() => navigate("/contacts")} />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
