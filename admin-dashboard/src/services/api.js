import axios from 'axios'

// Real Express + MongoDB backend. Set VITE_API_BASE_URL in .env
// e.g. VITE_API_BASE_URL=http://localhost:5000/api
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000
})

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// If the token is invalid/expired, the backend returns 401 — clear session
// so ProtectedRoute redirects to /login instead of looping on stale state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('admin_dashboard_auth')
    }
    return Promise.reject(error)
  }
)

// MongoDB returns _id; the rest of the app (DataTable, edit/delete handlers)
// expects id. Normalize once here so no other file needs to know about _id.
const normalize = (doc) => (doc ? { ...doc, id: doc._id } : doc)
const normalizeList = (docs) => docs.map(normalize)

const extractErrorMessage = (error) =>
  error.response?.data?.message || error.message || 'Something went wrong'

// ---------- Auth ----------
export const loginRequest = async ({ email, password }) => {
  try {
    const { data } = await api.post('/auth/login', { email, password })
    return { user: normalize(data.user), token: data.token }
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export const fetchCurrentUser = async () => {
  try {
    const { data } = await api.get('/auth/me')
    return normalize(data.user)
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

// ---------- Dashboard ----------
export const fetchDashboardStats = async () => {
  try {
    const { data } = await api.get('/dashboard/stats')
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export const fetchRevenueChart = async () => {
  try {
    const { data } = await api.get('/dashboard/revenue')
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export const fetchUserGrowthChart = async () => {
  try {
    const { data } = await api.get('/dashboard/user-growth')
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export const fetchSalesByCategory = async () => {
  try {
    const { data } = await api.get('/dashboard/sales-by-category')
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

// ---------- Users CRUD ----------
export const fetchUsers = async () => {
  try {
    const { data } = await api.get('/users')
    return normalizeList(data.users)
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export const addUser = async (user) => {
  try {
    const { data } = await api.post('/users', user)
    return normalize(data)
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export const updateUser = async (id, updates) => {
  try {
    const { data } = await api.put(`/users/${id}`, updates)
    return normalize(data)
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export const deleteUser = async (id) => {
  try {
    const { data } = await api.delete(`/users/${id}`)
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

// ---------- Products CRUD ----------
export const fetchProducts = async () => {
  try {
    const { data } = await api.get('/products')
    return normalizeList(data.products)
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export const addProduct = async (product) => {
  try {
    const { data } = await api.post('/products', product)
    return normalize(data)
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export const updateProduct = async (id, updates) => {
  try {
    const { data } = await api.put(`/products/${id}`, updates)
    return normalize(data)
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export const deleteProduct = async (id) => {
  try {
    const { data } = await api.delete(`/products/${id}`)
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

// ---------- Notifications ----------
export const fetchNotifications = async () => {
  try {
    const { data } = await api.get('/notifications')
    return data.map(item => ({
      ...item,
      id: item._id
    }))
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export const markNotificationRead = async (id) => {
  try {
    const { data } = await api.patch(`/notifications/${id}/read`)
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export const markAllNotificationsRead = async () => {
  try {
    const { data } = await api.patch('/notifications/read-all')
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}
