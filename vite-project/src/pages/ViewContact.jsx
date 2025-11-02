"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Mail, Phone, Building2, Briefcase } from "lucide-react"
import DashboardLayout from "../components/Layout/DashboardLayout"
import { getContactById } from "../services/api"
import { useAuth } from "../context/AuthContext"

export default function ViewContact() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
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
  }, [id, navigate])

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
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
          <h1 className="text-3xl font-bold text-white">Contact Details</h1>
        </div>

        {/* Contact Card */}
        {contact && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-8">
            {/* Avatar and Name */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center mb-4">
                {contact.image ? (
                  <img
                    src={contact.image || "/placeholder.svg"}
                    alt={contact.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-3xl">{getInitials(contact.name)}</span>
                )}
              </div>
              <h2 className="text-3xl font-bold text-white text-center">{contact.name}</h2>
              {contact.title && <p className="text-slate-400 mt-2">{contact.title}</p>}
              {contact.company && <p className="text-slate-500 text-sm">{contact.company}</p>}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contact.email && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={18} className="text-blue-400" />
                    <span className="text-sm text-slate-400">Email</span>
                  </div>
                  <p className="text-white">{contact.email}</p>
                </div>
              )}
              {contact.phone && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={18} className="text-green-400" />
                    <span className="text-sm text-slate-400">Phone</span>
                  </div>
                  <p className="text-white">{contact.phone}</p>
                </div>
              )}
              {contact.company && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={18} className="text-purple-400" />
                    <span className="text-sm text-slate-400">Company</span>
                  </div>
                  <p className="text-white">{contact.company}</p>
                </div>
              )}
              {contact.title && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={18} className="text-orange-400" />
                    <span className="text-sm text-slate-400">Job Title</span>
                  </div>
                  <p className="text-white">{contact.title}</p>
                </div>
              )}
            </div>

            {/* Type Badge */}
            {contact.category && (
              <div
                className={`px-4 py-2 rounded-lg text-center font-medium ${
                  contact.category === "Work" ? "bg-blue-500/20 text-blue-300" : "bg-purple-500/20 text-purple-300"
                }`}
              >
                {contact.category} Contact
              </div>
            )}

            {/* Action Buttons - Only show edit for admins */}
            <div className="flex gap-3 pt-4">
              {isAdmin() && (
                <button
                  onClick={() => navigate(`/contacts/update/${contact.id}`)}
                  className="flex-1 px-4 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all font-medium"
                >
                  Edit Contact
                </button>
              )}
              <button
                onClick={() => navigate("/contacts")}
                className={`${isAdmin() ? "flex-1" : "w-full"} px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all font-medium`}
              >
                Back to Contacts
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
