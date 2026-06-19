import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import Navbar from '../components/Navbar/Navbar'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Navbar sidebarCollapsed={collapsed} />
      <main
        className={`pt-20 pb-8 px-6 transition-all duration-200 ${
          collapsed ? 'ml-[72px]' : 'ml-60'
        }`}
      >
        <Outlet />
      </main>
    </div>
  )
}
