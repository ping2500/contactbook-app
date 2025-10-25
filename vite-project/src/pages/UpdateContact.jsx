"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import DashboardLayout from "../components/Layout/DashboardLayout"
import ContactForm from "../components/Contacts/ContactForm"

export default function UpdateContact() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch contact details
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const token = localStorage.getItem("token")

        // API call to fetch contact by ID
        const response = await fetch(`/api/contacts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch contact")

        const data = await response.json()
        setContact(data)
      } catch (error) {
        console.error("Error fetching contact:", error)
        navigate("/contacts")
      } finally {
        setLoading(false)
      }
    }

    fetchContact()
  }, [id, navigate])

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token")

      // API call to update contact
      const response = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update contact")

      navigate("/contacts")
    } catch (error) {
      console.error("Error updating contact:", error)
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
