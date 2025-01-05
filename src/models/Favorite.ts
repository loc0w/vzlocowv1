import { Schema, model, models } from 'mongoose';

const FavoriteSchema = new Schema({
  userEmail: { type: String, required: true },
  asin: { type: String, required: true },
  title: { type: String },
  imageUrl: { type: String },
  currentPrice: { type: Number },
  lastUpdate: { type: Date },
  priceHistory: { type: Array },
  stats: { type: Object },
},
{
  timestamps: true,
});

// Daha önce model tanımlanmışsa tekrar tanımlama:
export default models.Favorite || model('Favorite', FavoriteSchema);
