import { createContext, useContext, useReducer, useEffect } from 'react'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'admin_dashboard_settings'

const defaultSettings = {
  theme: 'light', // 'light' | 'dark'
  notifications: {
    emailAlerts: true,
    pushAlerts: false,
    weeklySummary: true
  }
}

function loadInitialState() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return { ...defaultSettings, ...JSON.parse(stored) }
    } catch {
      return defaultSettings
    }
  }
  return defaultSettings
}

function settingsReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' }
    case 'SET_NOTIFICATION':
      return {
        ...state,
        notifications: { ...state.notifications, [action.key]: action.value }
      }
    default:
      return state
  }
}

export function ThemeProvider({ children }) {
  const [settings, dispatch] = useReducer(settingsReducer, undefined, loadInitialState)

  // Persist to localStorage and toggle the 'dark' class on <html> for Tailwind
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    const root = document.documentElement
    if (settings.theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [settings])

  const toggleTheme = () => dispatch({ type: 'TOGGLE_THEME' })
  const setNotification = (key, value) => dispatch({ type: 'SET_NOTIFICATION', key, value })

  return (
    <ThemeContext.Provider value={{ ...settings, toggleTheme, setNotification }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider')
  return ctx
}
