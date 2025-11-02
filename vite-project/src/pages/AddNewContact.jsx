"use client"

import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import DashboardLayout from "../components/Layout/DashboardLayout"
import ContactForm from "../components/Contacts/ContactForm"
import { createContact } from "../services/api"

export default function AddNewContact() {
  const navigate = useNavigate()

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

      await createContact(data)
      navigate("/contacts")
    } catch (error) {
      console.error("Error creating contact:", error)
      alert(error.response?.data?.message || "Failed to create contact")
    }
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
            <h1 className="text-3xl font-bold text-white">Add New Contact</h1>
            <p className="text-slate-400 mt-1">Create a new contact in your address book</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <ContactForm onSubmit={handleSubmit} onCancel={() => navigate("/contacts")} />
        </div>
      </div>
    </DashboardLayout>
  )
}
