"use client"

import { X, Phone, Mail, Edit2, Trash2, Copy } from "lucide-react"
import { useState } from "react"

export default function ContactModal({ contact, onClose, onEdit, onDelete }) {
  const [copied, setCopied] = useState(null)

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Contact Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center mb-4">
              {contact.image ? (
                <img
                  src={contact.image || "/placeholder.svg"}
                  alt={contact.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <span className="text-white font-bold text-2xl">{getInitials(contact.name)}</span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white text-center">{contact.name}</h3>
            <p className="text-slate-400 text-sm mt-1">{contact.jobTitle || "No title"}</p>
            {contact.company && <p className="text-slate-500 text-xs mt-1">{contact.company}</p>}
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            {contact.email && (
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-400" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-sm text-white">{contact.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(contact.email, "email")}
                  className="p-2 hover:bg-white/10 rounded transition-all"
                >
                  <Copy size={16} className={copied === "email" ? "text-green-400" : "text-slate-400"} />
                </button>
              </div>
            )}

            {contact.phone && (
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-green-400" />
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-sm text-white">{contact.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(contact.phone, "phone")}
                  className="p-2 hover:bg-white/10 rounded transition-all"
                >
                  <Copy size={16} className={copied === "phone" ? "text-green-400" : "text-slate-400"} />
                </button>
              </div>
            )}
          </div>

          {/* Type Badge */}
          {contact.type && (
            <div
              className={`px-3 py-2 rounded-lg text-sm font-medium text-center ${
                contact.type === "Work" ? "bg-blue-500/20 text-blue-300" : "bg-purple-500/20 text-purple-300"
              }`}
            >
              {contact.type} Contact
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-6 border-t border-white/10">
          <button
            onClick={() => {
              onEdit()
              onClose()
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all font-medium"
          >
            <Edit2 size={18} />
            Edit
          </button>
          <button
            onClick={() => {
              onDelete()
              onClose()
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all font-medium"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
