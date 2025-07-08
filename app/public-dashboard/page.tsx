import Dashboard from "@/components/dashboard"

// Public dashboard without authentication
export default function PublicDashboard() {
  const handleLogout = () => {
    // Redirect to home or do nothing for public version
    window.location.href = "/"
  }

  return <Dashboard onLogout={handleLogout} />
}
