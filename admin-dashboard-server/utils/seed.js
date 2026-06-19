// Run with: npm run seed
// Populates an Admin login account plus sample Users and Products for demoing.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

const sampleUsers = [
  { name: 'Aarav Sharma', email: 'admin@example.com', password: 'admin123', role: 'Admin', status: 'Active' },
  { name: 'Priya Nair', email: 'priya.nair@example.com', password: 'password123', role: 'Manager', status: 'Active' },
  { name: 'Rohan Mehta', email: 'rohan.mehta@example.com', password: 'password123', role: 'Customer', status: 'Inactive' },
  { name: 'Sneha Patil', email: 'sneha.patil@example.com', password: 'password123', role: 'Customer', status: 'Active' },
  { name: 'Vikram Singh', email: 'vikram.singh@example.com', password: 'password123', role: 'Manager', status: 'Active' },
  { name: 'Anjali Gupta', email: 'anjali.gupta@example.com', password: 'password123', role: 'Customer', status: 'Inactive' },
  { name: 'Karan Verma', email: 'karan.verma@example.com', password: 'password123', role: 'Customer', status: 'Active' }
];

const sampleProducts = [
  { name: 'Wireless Mouse', category: 'Electronics', price: 799, stock: 120 },
  { name: 'Mechanical Keyboard', category: 'Electronics', price: 2499, stock: 45 },
  { name: 'USB-C Hub', category: 'Accessories', price: 1299, stock: 0 },
  { name: 'Laptop Stand', category: 'Accessories', price: 999, stock: 60 },
  { name: '27" Monitor', category: 'Electronics', price: 14999, stock: 18 },
  { name: 'Webcam HD', category: 'Electronics', price: 1899, stock: 0 },
  { name: 'Desk Lamp', category: 'Home Office', price: 599, stock: 80 },
  { name: 'Office Chair', category: 'Furniture', price: 8999, stock: 12 },
  { name: 'Notebook Set', category: 'Stationery', price: 249, stock: 200 },
  { name: 'Bluetooth Speaker', category: 'Electronics', price: 2199, stock: 30 }
];

const seed = async () => {
  await connectDB();

  await User.deleteMany();
  await Product.deleteMany();

  // Use create (not insertMany) so the pre-save password-hashing hook runs
  for (const u of sampleUsers) {
    await User.create(u);
  }
  for (const p of sampleProducts) {
    await Product.create(p);
  }

  console.log('Seed complete.');
  console.log('Login with: admin@example.com / admin123');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
