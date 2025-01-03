// src/types/keepa.ts

// Ana ürün tipi
export interface KeepaProduct {
  asin: string;
  title: string;
  currentPrice: number | null;
  imageUrl: string;
  lastUpdate: string;
  priceHistory: PriceHistoryItem[];
  stats: PriceStats;
}

// Fiyat geçmişi öğesi
export interface PriceHistoryItem {
  date: string;
  price: number;
}

// Fiyat istatistikleri
export interface PriceStats {
  current: number | null;    // Mevcut fiyat
  avg30: number | null;      // 30 günlük ortalama
  avg90: number | null;      // 90 günlük ortalama
  avg180: number | null;     // 180 günlük ortalama
  min30: number | null;      // 30 günlük minimum
  min90: number | null;      // 90 günlük minimum
  min180: number | null;     // 180 günlük minimum
  max30: number | null;      // 30 günlük maksimum
  max90: number | null;      // 90 günlük maksimum
  max180: number | null;     // 180 günlük maksimum
}

// Keepa API yanıt tipi
export interface KeepaApiResponse {
  products: KeepaApiProduct[];
  error?: {
    message: string;
  };
}

// Keepa API ürün tipi
export interface KeepaApiProduct {
  asin: string;
  title: string;
  lastUpdate: number;
  imagesCSV?: string;
  csv: number[][];
  stats: {
    current?: number[];
    avg30?: number[];
    avg90?: number[];
    avg180?: number[];
    min?: [number[]];
    max?: [number[]];
    buyBoxPrice?: number;
  };
}

// API hata tipi
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Fiyat trend tipi
export type PriceTrend = 'up' | 'down' | 'stable' | 'unknown';

// Fiyat karşılaştırma sonucu
export interface PriceComparison {
  trend: PriceTrend;
  difference: number | null;
  percentage: number | null;
  status: string;
}

// Fiyat analizi sonucu
export interface PriceAnalysis {
  currentPrice: number | null;
  averagePrice: number | null;
  lowestPrice: number | null;
  highestPrice: number | null;
  priceChange: number | null;
  priceChangePercentage: number | null;
  trend: PriceTrend;
  recommendation: string;
}

// Keepa API istek parametreleri
export interface KeepaApiParams {
  key: string;
  domain: number;
  asin: string;
  stats?: number;
  history?: number;
  offers?: number;
  update?: number;
  rating?: number;
  buyBox?: number;
}

// Fiyat uyarı ayarları
export interface PriceAlertSettings {
  targetPrice: number;
  alertType: 'below' | 'above';
  enabled: boolean;
  email?: string;
  frequency?: 'immediately' | 'daily' | 'weekly';
}

// Fiyat geçmişi filtreleme seçenekleri
export interface PriceHistoryFilter {
  startDate?: Date;
  endDate?: Date;
  minPrice?: number;
  maxPrice?: number;
  trendOnly?: boolean;
}

// Fiyat istatistikleri periyodu
export type StatsPeriod = '30' | '90' | '180';

// Fiyat karşılaştırma metriği
export type ComparisonMetric = 'average' | 'lowest' | 'highest';