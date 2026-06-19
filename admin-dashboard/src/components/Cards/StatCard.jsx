export default function StatCard({ title, value, icon: Icon, accent = 'primary', trend }) {
  const accentMap = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">{value}</h3>
        {trend && (
          <p className={`text-xs mt-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
            {trend} vs last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${accentMap[accent]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  )
}
