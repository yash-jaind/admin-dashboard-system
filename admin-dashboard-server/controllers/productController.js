const Product = require('../models/Product');
const Notification = require('../models/Notification');

// GET /api/products?search=&page=&limit=
const getProducts = async (req, res, next) => {
  try {
    const { search = '', page = 1, limit = 100 } = req.query;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(query)
    ]);

    res.json({ products, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};
                                                          
// POST /api/products;
const createProduct = async (req, res, next) => {
  try {
    const { name, category, price, stock } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({
        message: 'Name, price, and stock are required'
      });
    }

    const product = await Product.create({
      name,
      category,
      price,
      stock
    });

    await Notification.create({
      title: 'New Product',
      message: `${name} was added`,
      type: 'product'
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const { name, category, price, stock } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock; // pre-save hook recalculates status

    await product.save();
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
const product = await Product.findByIdAndDelete(req.params.id);

if (!product)
  return res.status(404).json({ message: 'Product not found' });

await Notification.create({
  title: 'Product Deleted',
  message: product.name,
  type: 'product'
});

res.json({ message: 'Product deleted successfully' });
  } 
  catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
