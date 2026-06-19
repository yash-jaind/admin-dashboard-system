// Format a number as Indian Rupee currency
export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value)

// Format large numbers with commas (Indian numbering)
export const formatNumber = (value) => new Intl.NumberFormat('en-IN').format(value)

// Format ISO date string to readable format
export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Simple case-insensitive search filter across given keys of an object array
export const filterBySearch = (items, searchTerm, keys) => {
  if (!searchTerm) return items
  const term = searchTerm.toLowerCase()
  return items.filter((item) =>
    keys.some((key) => String(item[key]).toLowerCase().includes(term))
  )
}

// Paginate an array
export const paginate = (items, page, pageSize) => {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

// Status badge color mapping (Tailwind classes)
export const statusColors = {
  Active: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  'In Stock': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  'Out of Stock': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
}
