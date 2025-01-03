// src/types/product.ts

export interface Product {
    asin: string;
    title: string;
    currentPrice: number | null;
    previousPrice: number | null;
    imageUrl: string;
    lastUpdated: string;
    rating: number | null;
    reviewCount: number | null;
    salesRanks: {
      current: number | null;
      avg30: number | null;
      avg90: number | null;
      avg180: number | null;
    };
    priceHistory: {
      date: string;
      price: number;
    }[];
    stats: {
      lowestPrice: number | null;
      highestPrice: number | null;
      averagePrice: number | null;
    };
  }