const express = require('express');
const {
  getStats,
  getRevenueChart,
  getUserGrowthChart,
  getSalesByCategory
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // all dashboard routes require authentication

router.get('/stats', getStats);
router.get('/revenue', getRevenueChart);
router.get('/user-growth', getUserGrowthChart);
router.get('/sales-by-category', getSalesByCategory);

module.exports = router;
