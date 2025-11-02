"use client"

import { useState } from "react"
import { User, Mail, Phone, Building2, Briefcase, ImageIcon, X } from "lucide-react"

export default function ContactForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      type: "Personal",
      imageFile: null,
    },
  )
  const [imagePreview, setImagePreview] = useState(initialData?.image || null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData((prev) => ({ ...prev, imageFile: file }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Profile Image</label>
        <div className="flex gap-4">
          {imagePreview && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null)
                  setFormData((prev) => ({ ...prev, imageFile: null }))
                }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          )}
          <label className="flex-1 flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-4 cursor-pointer hover:border-blue-400/50 hover:bg-white/5 transition-all">
            <div className="text-center">
              <ImageIcon size={24} className="mx-auto text-slate-400 mb-2" />
              <span className="text-sm text-slate-400">Click to upload</span>
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
        <div className="relative">
          <User size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
        <div className="relative">
          <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
        <div className="relative">
          <Phone size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Company</label>
        <div className="relative">
          <Building2 size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Acme Inc."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Job Title */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Job Title</label>
        <div className="relative">
          <Briefcase size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Product Manager"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Contact Type */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Contact Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
        >
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white rounded-lg transition-all font-medium"
        >
          {loading ? "Saving..." : "Save Contact"}
        </button>
      </div>
    </form>
  )
}
