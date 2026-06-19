
const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // all product routes require authentication

router.route('/')
  .get(getProducts)
  .post(authorize("Admin", "Manager"), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(authorize("Admin", "Manager"), updateProduct)
  .delete(authorize("Admin", "Manager"), deleteProduct);
module.exports = router;
