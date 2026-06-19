import { Sun, Moon } from 'lucide-react'
import { useThemeContext } from '../context/ThemeContext'

const notificationOptions = [
  { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive important updates via email' },
  { key: 'pushAlerts', label: 'Push Alerts', description: 'Get real-time push notifications' },
  { key: 'weeklySummary', label: 'Weekly Summary', description: 'A digest of activity every week' }
]

export default function Settings() {
  const { theme, toggleTheme, notifications, setNotification } = useThemeContext()

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Customize your dashboard experience</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-primary-500" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">Dark Mode</p>
                <p className="text-xs text-gray-400">Switch between light and dark themes</p>
              </div>
            </div>
            <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
            Notification Preferences
          </h2>
          <div className="space-y-4">
            {notificationOptions.map((opt) => (
              <div key={opt.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{opt.label}</p>
                  <p className="text-xs text-gray-400">{opt.description}</p>
                </div>
                <ToggleSwitch
                  checked={notifications[opt.key]}
                  onChange={(value) => setNotification(opt.key, value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
