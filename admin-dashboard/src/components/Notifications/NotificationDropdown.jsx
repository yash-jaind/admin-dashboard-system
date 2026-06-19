import { useEffect, useState } from 'react'
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../../services/api'

export default function NotificationDropdown({ setUnreadCount }) {
  const [notifications, setNotifications] = useState([])

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications()

      setNotifications(data)

      setUnreadCount(
        data.filter(n => !n.isRead).length
      )
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const handleRead = async (id) => {
    await markNotificationRead(id)
    loadNotifications()
  }
const handleMarkAll = async () => {
  await markAllNotificationsRead()

  setNotifications([])
  setUnreadCount(0)
}

  return (
    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium">Notifications</h3>

        <button
          onClick={handleMarkAll}
          className="text-xs text-primary-600"
        >
          Mark All Read
        </button>
      </div>

      <div className="max-h-80 overflow-y-a
      uto">
        {notifications.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => handleRead(notification.id)}
             className={`p-3 border-b cursor-pointer ${
  notification.isRead
    ? 'opacity-50'
    : 'bg-blue-50 dark:bg-blue-900/20'
}`}
            >
              <p className="font-medium">
                {notification.title}
              </p>

              <p className="text-sm text-gray-500">
                {notification.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}