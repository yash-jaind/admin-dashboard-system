import { RevenueLineChart, UserGrowthBarChart, CategoryPieChart } from '../components/Charts/Charts'
import Loader from '../components/Loader'
import { ErrorState } from '../components/StateViews'
import { useFetch } from '../hooks/useFetch'
import { fetchRevenueChart, fetchUserGrowthChart, fetchSalesByCategory } from '../services/api'

export default function Analytics() {
  const { data: revenue, loading: l1, error: e1 } = useFetch(fetchRevenueChart, [])
  const { data: growth, loading: l2, error: e2 } = useFetch(fetchUserGrowthChart, [])
  const { data: categories, loading: l3, error: e3 } = useFetch(fetchSalesByCategory, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Revenue, growth, and sales breakdown
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Revenue Trend</h2>
        {l1 && <Loader />}
        {e1 && <ErrorState message={e1} />}
        {revenue && <RevenueLineChart data={revenue} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">User Growth</h2>
          {l2 && <Loader />}
          {e2 && <ErrorState message={e2} />}
          {growth && <UserGrowthBarChart data={growth} />}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Sales by Category</h2>
          {l3 && <Loader />}
          {e3 && <ErrorState message={e3} />}
          {categories && <CategoryPieChart data={categories} />}
        </div>
      </div>
    </div>
  )
}
