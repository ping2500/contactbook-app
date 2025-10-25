import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function DashboardLayout({ children, userName = "User" }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />
      <Topbar userName={userName} />

      {/* Main Content */}
      <main className="lg:ml-64 mt-16 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
