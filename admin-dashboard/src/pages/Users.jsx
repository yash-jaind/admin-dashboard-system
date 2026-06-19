import { useState } from 'react'
import { toast } from 'react-toastify'
import DataTable from '../components/Tables/DataTable'
import Modal from '../components/Modal'
import UserForm from '../components/Forms/UserForm'
import Loader from '../components/Loader'
import { ErrorState } from '../components/StateViews'
import { useFetch } from '../hooks/useFetch'
import { fetchUsers, addUser, updateUser, deleteUser } from '../services/api'
import { formatDate } from '../utils/helpers'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'joined', label: 'Joined', render: (row) => formatDate(row.joined) }
]

export default function Users() {
  const { data: users, loading, error, refetch } = useFetch(fetchUsers, [])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const openAddModal = () => {
    setEditingUser(null)
    setModalOpen(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setModalOpen(true)
  }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    try {
      if (editingUser) {
        await updateUser(editingUser.id, values)
        toast.success('User updated successfully')
      } else {
        await addUser(values)
        toast.success('User added successfully')
      }
      setModalOpen(false)
      refetch()
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}? This action cannot be undone.`)) return
    try {
      await deleteUser(user.id)
      toast.success('User deleted')
      refetch()
    } catch (err) {
      toast.error(err.message || 'Failed to delete user')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Users</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage platform users</p>
      </div>

      {loading && <Loader size="lg" />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {users && (
        <DataTable
          data={users}
          columns={columns}
          searchKeys={['name', 'email', 'role']}
          onAdd={openAddModal}
          onEdit={openEditModal}
          onDelete={handleDelete}
          addLabel="Add User"
        />
      )}

      {modalOpen && (
        <Modal title={editingUser ? 'Edit User' : 'Add User'} onClose={() => setModalOpen(false)}>
          <UserForm
            initialValues={editingUser}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  )
}
