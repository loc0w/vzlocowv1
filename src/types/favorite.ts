// src/types/favorite.ts
export interface Favorite {
    _id: string;
    userId: string;
    asin: string;
    title: string;
    imageUrl: string;
    currentPrice: number | null;
    lastPrice: number | null;
    lastUpdate: Date;
    priceHistory: Array<{
      date: Date;
      price: number;
    }>;
    stats: {
      avg30?: number;
      avg90?: number;
      avg180?: number;
      min30?: number;
      min90?: number;
      min180?: number;
      max30?: number;
      max90?: number;
      max180?: number;
    };
    createdAt: Date;
    updatedAt: Date;
  }