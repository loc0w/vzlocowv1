// src/models/schema.ts
import mongoose, { model } from 'mongoose';

// Kullanıcı Şeması
const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  image: String,
  plan: {
    type: String,
    enum: ['FREE', 'PRO', 'PRO_PLUS'],
    default: 'FREE'
  },
  dailyScans: {
    count: { type: Number, default: 0 },
    lastReset: { type: Date, default: Date.now }
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdAt: { type: Date, default: Date.now }
});

// Ürün Şeması
const ProductSchema = new mongoose.Schema({
  asin: { type: String, unique: true },
  title: String,
  image: String,
  currentPrice: Number,
  priceHistory: [{
    price: Number,
    date: Date
  }],
  lowestPrice: Number,
  highestPrice: Number,
  lastUpdated: Date
});

// Tarama Limitleri
const SCAN_LIMITS = {
  FREE: 5,
  PRO: 50,
  PRO_PLUS: 1000
};

export const User = model('User', UserSchema);
export const Product = model('Product', ProductSchema);