"use client"

import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import DashboardLayout from "../components/Layout/DashboardLayout"
import ContactForm from "../components/Contacts/ContactForm"

export default function AddNewContact() {
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token")

      // API call to create new contact
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to create contact")

      navigate("/contacts")
    } catch (error) {
      console.error("Error creating contact:", error)
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
