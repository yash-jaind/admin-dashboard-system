import { NavLink } from 'react-router-dom'
import {
LayoutDashboard,
Users,
Package,
BarChart3,
User,
Settings,
ChevronLeft,
ChevronRight,
Briefcase
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
{ to: '/', label: 'Dashboard', icon: LayoutDashboard },
{ to: '/users', label: 'Users', icon: Users, adminOnly: true },
{ to: '/products', label: 'Products', icon: Package },
{ to: '/analytics', label: 'Analytics', icon: BarChart3 },
{ to: '/profile', label: 'Profile', icon: User },
{ to: '/settings', label: 'Settings', icon: Settings }
]

export default function Sidebar({ collapsed, setCollapsed }) {
const { user } = useAuth()
const userRole = user?.role

return (
<aside
className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col transition-all duration-200 z-20 ${
        collapsed ? 'w-[72px]' : 'w-60'
      }`}
> <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 dark:border-gray-700">
{!collapsed && ( <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white"> <Briefcase className="w-5 h-5 text-primary-600" /> <span>AdminPanel</span> </div>
)}

```
    <button
      onClick={() => setCollapsed((prev) => !prev)}
      className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 ml-auto"
      aria-label="Toggle sidebar"
    >
      {collapsed ? (
        <ChevronRight className="w-4 h-4" />
      ) : (
        <ChevronLeft className="w-4 h-4" />
      )}
    </button>
  </div>

  <nav className="flex-1 py-4 px-2 space-y-1">
    {navItems
      .filter(item => !item.adminOnly || userRole === 'Admin')
      .map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
          title={collapsed ? label : undefined}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
  </nav>
</aside>

)
}
