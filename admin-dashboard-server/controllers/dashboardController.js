const User = require('../models/User');
const Product = require('../models/Product');

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// GET /api/dashboard/stats
const getStats = async (req, res, next) => {
  try {
    const [userCount, productCount, revenueData] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Product.aggregate([
        {
          $project: {
            revenue: {
              $multiply: [
                '$price',
                {
                  $max: [
                    5,
                    {
                      $subtract: [
                        20,
                        { $mod: ['$stock', 20] }
                      ]
                    }
                  ]
                }
              ]
            },
            orders: {
              $max: [
                5,
                {
                  $subtract: [
                    20,
                    { $mod: ['$stock', 20] }
                  ]
                }
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$revenue' },
            totalOrders: { $sum: '$orders' }
          }
        }
      ])
    ]);

    const stats = revenueData[0] || {
      totalRevenue: 0,
      totalOrders: 0
    };

    res.json({
      totalUsers: userCount,
      totalProducts: productCount,
      totalRevenue: stats.totalRevenue,
      totalOrders: stats.totalOrders
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/revenue
const getRevenueChart = async (req, res, next) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' }
          },
          revenue: {
            $sum: {
              $multiply: [
                '$price',
                {
                  $max: [
                    5,
                    {
                      $subtract: [
                        20,
                        { $mod: ['$stock', 20] }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        }
      },
      {
        $sort: {
          '_id.month': 1
        }
      }
    ]);

    const data = result.map(item => ({
      month: MONTH_NAMES[item._id.month - 1],
      revenue: item.revenue
    }));

    res.json(
      data.length
        ? data
        : MONTH_NAMES.slice(0, 6).map(month => ({
            month,
            revenue: 0
          }))
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/user-growth
const getUserGrowthChart = async (req, res, next) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' }
          },
          users: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          '_id.month': 1
        }
      }
    ]);

    let cumulative = 0;

    const data = result.map(item => {
      cumulative += item.users;

      return {
        month: MONTH_NAMES[item._id.month - 1],
        users: cumulative
      };
    });

    res.json(
      data.length
        ? data
        : MONTH_NAMES.slice(0, 6).map(month => ({
            month,
            users: 0
          }))
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/sales-by-category
const getSalesByCategory = async (req, res, next) => {
  try {
   const data = await Product.aggregate([
  {
    $group: {
      _id: "$category",
      sales: {
        $sum: "$price"
      }
    }
  },
  {
    $project: {
      _id: 0,
      category: "$_id",
      sales: 1
    }
  }
]);

    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getRevenueChart,
  getUserGrowthChart,
  getSalesByCategory
};