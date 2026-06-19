import { Users, Package, IndianRupee, ShoppingCart } from 'lucide-react'
import StatCard from '../components/Cards/StatCard'
import { RevenueLineChart, UserGrowthBarChart } from '../components/Charts/Charts'
import Loader from '../components/Loader'
import { ErrorState } from '../components/StateViews'
import { useFetch } from '../hooks/useFetch'
import { fetchDashboardStats, fetchRevenueChart, fetchUserGrowthChart } from '../services/api'
import { formatCurrency, formatNumber } from '../utils/helpers'

export default function Dashboard() {
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } =
    useFetch(fetchDashboardStats, [])
  const { data: revenue, loading: revenueLoading, error: revenueError } =
    useFetch(fetchRevenueChart, [])
  const { data: growth, loading: growthLoading, error: growthError } =
    useFetch(fetchUserGrowthChart, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of your platform's performance
        </p>
      </div>

      {statsLoading && <Loader size="lg" />}
      {statsError && <ErrorState message={statsError} onRetry={refetchStats} />}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={formatNumber(stats.totalUsers)} icon={Users} accent="primary" trend="+12%" />
          <StatCard title="Total Products" value={formatNumber(stats.totalProducts)} icon={Package} accent="amber" trend="+4%" />
          <StatCard title="Revenue" value={formatCurrency(stats.totalRevenue)} icon={IndianRupee} accent="green" trend="+18%" />
          <StatCard title="Total Orders" value={formatNumber(stats.totalOrders)} icon={ShoppingCart} accent="rose" trend="-3%" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Monthly Revenue
          </h2>
          {revenueLoading && <Loader />}
          {revenueError && <ErrorState message={revenueError} />}
          {revenue && <RevenueLineChart data={revenue} />}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            User Growth
          </h2>
          {growthLoading && <Loader />}
          {growthError && <ErrorState message={growthError} />}
          {growth && <UserGrowthBarChart data={growth} />}
        </div>
      </div>
    </div>
  )
}
