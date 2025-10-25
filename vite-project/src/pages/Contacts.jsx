"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Search, Filter } from "lucide-react"
import DashboardLayout from "../components/Layout/DashboardLayout"
import ContactCard from "../components/Contacts/ContactCard"
import ContactModal from "../components/Contacts/ContactModal"

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("All")
  const [selectedContact, setSelectedContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Fetch contacts from backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/login")
          return
        }

        // API call to fetch contacts
        const response = await fetch("/api/contacts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch contacts")

        const data = await response.json()
        setContacts(data)
        setFilteredContacts(data)
      } catch (error) {
        console.error("Error fetching contacts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [navigate])

  // Filter contacts based on search and type
  useEffect(() => {
    let filtered = contacts

    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.phone?.includes(searchTerm),
      )
    }

    if (filterType !== "All") {
      filtered = filtered.filter((contact) => contact.type === filterType)
    }

    setFilteredContacts(filtered)
  }, [searchTerm, filterType, contacts])

  const handleDelete = async () => {
    if (!selectedContact) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/contacts/${selectedContact.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to delete contact")

      setContacts(contacts.filter((c) => c.id !== selectedContact.id))
      setSelectedContact(null)
    } catch (error) {
      console.error("Error deleting contact:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Contacts</h1>
            <p className="text-slate-400 mt-1">{filteredContacts.length} contacts</p>
          </div>
          <button
            onClick={() => navigate("/contacts/add")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all font-medium w-full md:w-auto"
          >
            <Plus size={20} />
            Add Contact
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
            >
              <option value="All">All Types</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
        </div>

        {/* Contacts Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Loading contacts...</div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-slate-400 mb-4">No contacts found</p>
            <button
              onClick={() => navigate("/contacts/add")}
              className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all"
            >
              Create your first contact
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} onClick={() => setSelectedContact(contact)} />
            ))}
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {selectedContact && (
        <ContactModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onEdit={() => navigate(`/contacts/update/${selectedContact.id}`)}
          onDelete={handleDelete}
        />
      )}
    </DashboardLayout>
  )
}
