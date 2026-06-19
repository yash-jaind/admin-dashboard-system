import { useState, useEffect, useCallback } from 'react'

/**
 * Generic data-fetching hook.
 * Returns { data, loading, error, refetch } so pages can render
 * loading spinners, error states, and empty states consistently.
 *
 * @param {Function} fetchFn - async function that returns data
 * @param {Array} deps - dependency array to control re-fetching
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refetch: load }
}
