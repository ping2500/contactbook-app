"use client"

import { useState, useEffect } from "react"
import { Users, UserCheck, Briefcase, TrendingUp } from "lucide-react"
import DashboardLayout from "../components/Layout/DashboardLayout"
import ContactCard from "../components/Contacts/ContactCard"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    workContacts: 0,
    personalContacts: 0,
  })
  const [recentContacts, setRecentContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token")

        // API call to fetch dashboard stats
        const response = await fetch("/api/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch stats")

        const data = await response.json()
        setStats(data.stats)
        setRecentContacts(data.recentContacts || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      icon: Users,
      label: "Total Contacts",
      value: stats.totalContacts,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Briefcase,
      label: "Work Contacts",
      value: stats.workContacts,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: UserCheck,
      label: "Personal Contacts",
      value: stats.personalContacts,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: TrendingUp,
      label: "Growth",
      value: "↑ 12%",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold text-white">Welcome back!</h1>
          <p className="text-slate-400 mt-2">Here's what's happening with your contacts today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-blue-400/30 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${stat.bgColor} group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Contacts Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Recent Contacts</h2>
              <p className="text-slate-400 text-sm mt-1">Your most recently added contacts</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-slate-400">Loading recent contacts...</div>
            </div>
          ) : recentContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white/5 border border-white/10 rounded-xl">
              <Users size={48} className="text-slate-600 mb-4" />
              <p className="text-slate-400 mb-4">No contacts yet</p>
              <a
                href="/contacts/add"
                className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all"
              >
                Add your first contact
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentContacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} onClick={() => {}} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-xl p-6 hover:border-blue-400/50 transition-all cursor-pointer">
            <h3 className="text-lg font-semibold text-white mb-2">Import Contacts</h3>
            <p className="text-slate-400 text-sm">Bulk import contacts from CSV or other sources</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-6 hover:border-purple-400/50 transition-all cursor-pointer">
            <h3 className="text-lg font-semibold text-white mb-2">Export Contacts</h3>
            <p className="text-slate-400 text-sm">Export your contacts to CSV or other formats</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
