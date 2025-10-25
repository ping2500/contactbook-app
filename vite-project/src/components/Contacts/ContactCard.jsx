"use client"

import { Mail, Phone, Building2 } from "lucide-react"

export default function ContactCard({ contact, onClick }) {
  // Generate initials from name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <button
      onClick={onClick}
      className="group w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-300 text-left"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
          {contact.image ? (
            <img
              src={contact.image || "/placeholder.svg"}
              alt={contact.name}
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            <span className="text-white font-semibold text-sm">{getInitials(contact.name)}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
            {contact.name}
          </h3>
          <p className="text-sm text-slate-400 truncate">{contact.jobTitle || "No title"}</p>

          {/* Details */}
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-400">
            {contact.company && (
              <div className="flex items-center gap-1">
                <Building2 size={14} />
                <span className="truncate">{contact.company}</span>
              </div>
            )}
            {contact.email && (
              <div className="flex items-center gap-1">
                <Mail size={14} />
                <span className="truncate">{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-1">
                <Phone size={14} />
                <span>{contact.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Type Badge */}
        {contact.type && (
          <div
            className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
              contact.type === "Work" ? "bg-blue-500/20 text-blue-300" : "bg-purple-500/20 text-purple-300"
            }`}
          >
            {contact.type}
          </div>
        )}
      </div>
    </button>
  )
}
