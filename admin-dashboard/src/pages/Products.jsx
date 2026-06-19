import { useState } from 'react'
import { toast } from 'react-toastify'
import DataTable from '../components/Tables/DataTable'
import Modal from '../components/Modal'
import ProductForm from '../components/Forms/ProductForm'
import Loader from '../components/Loader'
import { ErrorState } from '../components/StateViews'
import { useFetch } from '../hooks/useFetch'
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../services/api'
import { formatCurrency } from '../utils/helpers'

const columns = [
  { key: 'name', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price', render: (row) => formatCurrency(row.price) },
  { key: 'stock', label: 'Stock' },
  { key: 'status', label: 'Status' }
]

export default function Products() {
  const { data: products, loading, error, refetch } = useFetch(fetchProducts, [])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const openAddModal = () => {
    setEditingProduct(null)
    setModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, values)
        toast.success('Product updated successfully')
      } else {
        await addProduct(values)
        toast.success('Product added successfully')
      }
      setModalOpen(false)
      refetch()
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete ${product.name}? This action cannot be undone.`)) return
    try {
      await deleteProduct(product.id)
      toast.success('Product deleted')
      refetch()
    } catch (err) {
      toast.error(err.message || 'Failed to delete product')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Products</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage product catalog and stock</p>
      </div>

      {loading && <Loader size="lg" />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {products && (
        <DataTable
          data={products}
          columns={columns}
          searchKeys={['name', 'category']}
          onAdd={openAddModal}
          onEdit={openEditModal}
          onDelete={handleDelete}
          addLabel="Add Product"
        />
      )}

      {modalOpen && (
        <Modal title={editingProduct ? 'Edit Product' : 'Add Product'} onClose={() => setModalOpen(false)}>
          <ProductForm
            initialValues={editingProduct}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  )
}
