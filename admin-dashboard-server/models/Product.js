const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Electronics', 'Accessories', 'Furniture', 'Stationery', 'Home Office'],
      default: 'Electronics'
    },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    status: { type: String, enum: ['In Stock', 'Out of Stock'], default: 'In Stock' }
  },
  { timestamps: true }
);

// Keep status in sync with stock automatically, regardless of caller
productSchema.pre('save', function (next) {
  this.status = this.stock > 0 ? 'In Stock' : 'Out of Stock';
  next();
});

module.exports = mongoose.model('Product', productSchema);
