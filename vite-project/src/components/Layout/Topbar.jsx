"use client"

import { useState } from "react"
import { Bell, Search, ChevronDown, User } from "lucide-react"

export default function Topbar({ userName = "User" }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all w-full"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-white/10 transition-all relative">
            <Bell size={20} className="text-slate-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-sm text-slate-300 hidden sm:inline">{userName}</span>
              <ChevronDown size={16} className="text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl overflow-hidden">
                <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/10 transition-all">
                  Profile Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/10 transition-all">
                  Preferences
                </button>
                <hr className="border-white/10" />
                <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-all">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
