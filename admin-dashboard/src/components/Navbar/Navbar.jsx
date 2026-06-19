import { Search, Sun, Moon, LogOut, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useThemeContext } from '../../context/ThemeContext'
import NotificationDropdown from '../Notifications/NotificationDropdown'
import { useState } from 'react'
export default function Navbar({ sidebarCollapsed }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useThemeContext()
  const navigate = useNavigate()
const [showNotifications, setShowNotifications] = useState(false)
const [unreadCount, setUnreadCount] = useState(0)
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-6 z-10 transition-all duration-200 ${
        sidebarCollapsed ? 'left-[72px]' : 'left-60'
      }`}
    >
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

       <div className="relative">
  <button
    onClick={() => setShowNotifications(prev => !prev)}
    className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
    aria-label="Notifications"
  >
    <Bell className="w-5 h-5" />

    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
        {unreadCount}
      </span>
    )}
  </button>

  {showNotifications && (
    <NotificationDropdown
      setUnreadCount={setUnreadCount}
    />
  )}
</div>

        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="hidden sm:block text-sm">
            <p className="font-medium text-gray-800 dark:text-white leading-tight">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
