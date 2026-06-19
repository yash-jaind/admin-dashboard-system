import { createContext, useContext, useState, useEffect } from 'react'
import { loginRequest, fetchCurrentUser } from '../services/api'

const AuthContext = createContext(null)

const USER_KEY = 'admin_dashboard_user'
const TOKEN_KEY = 'token' // also read directly by the axios interceptor in services/api.js

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // On first load, restore the token and validate it against the backend.
  // If it's expired/invalid, the api.js response interceptor clears storage
  // and the /auth/me call below will fail, so we just fall through to logged-out.
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      if (!storedToken) {
        setLoading(false)
        return
      }

      setToken(storedToken)
      try {
        const freshUser = await fetchCurrentUser()
        setUser(freshUser)
        localStorage.setItem(USER_KEY, JSON.stringify(freshUser))
      } catch {
        setUser(null)
        setToken(null)
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  const login = async (email, password) => {
    const { user, token } = await loginRequest({ email, password })
    setUser(user)
    setToken(token)
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return user
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  // Profile edits (name/email) are saved locally for now — wire to
  // PUT /api/users/:id with the logged-in user's own id if you want this persisted.
  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
