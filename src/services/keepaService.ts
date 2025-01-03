import axios from 'axios';
import type { KeepaProduct, PriceStats, KeepaApiResponse } from '@/types/keepa';

class KeepaService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    const apiKey = process.env.KEEPA_API_KEY;
    if (!apiKey) {
      throw new Error('KEEPA_API_KEY is not defined');
    }
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.keepa.com/product';
  }

  async getProductDetails(asin: string): Promise<KeepaProduct> {
    try {
      // Keepa API'nin beklediği formatta URL oluştur
      const url = `${this.baseUrl}?key=${this.apiKey}&domain=1&asin=${asin}&stats=180`;

      console.log('Requesting Keepa API:', url.replace(this.apiKey, '***'));

      const response = await axios.get<KeepaApiResponse>(url, {
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('API Response:', {
        status: response.status,
        data: response.data
      });

      if (response.data.error) {
        console.error('Keepa API Error:', response.data.error);
        throw new Error(response.data.error.message);
      }

      const product = response.data.products?.[0];
      if (!product) {
        throw new Error('Ürün bulunamadı');
      }

      // CSV verilerinden fiyat geçmişini çıkar
      const priceHistory = this.processKeepaHistory(product.csv);
      
      // İstatistikleri çıkar
      const stats = this.extractStats(product.stats || {});

      const result = {
        asin: product.asin,
        title: product.title || 'İsimsiz Ürün',
        currentPrice: this.getCurrentPrice(product),
        imageUrl: this.getProductImage(product),
        lastUpdate: new Date(product.lastUpdate * 1000).toISOString(),
        priceHistory,
        stats
      };

      console.log('Processed Result:', result);

      return result;

    } catch (error) {
      console.error('Keepa API Error Details:', {
        error,
        isAxiosError: axios.isAxiosError(error),
        response: axios.isAxiosError(error) ? error.response?.data : null
      });
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error?.message || error.message;

        switch (status) {
          case 400:
            throw new Error('API Hatası: ASIN veya domain parametresi geçersiz');
          case 401:
            throw new Error('API Hatası: API anahtarı geçersiz veya eksik');
          case 403:
            throw new Error('API Hatası: API erişimi reddedildi');
          case 429:
            throw new Error('API Hatası: İstek limiti aşıldı');
          case 404:
            throw new Error('API Hatası: Ürün bulunamadı');
          default:
            throw new Error(`API Hatası: ${message}`);
        }
      }

      throw error;
    }
  }

  private getCurrentPrice(product: any): number | null {
    if (product.stats?.current?.[0] !== undefined && product.stats.current[0] !== -1) {
      return this.convertKeepaPrice(product.stats.current[0]);
    }
    return null;
  }

  private extractStats(stats: any): PriceStats {
    const getPrice = (arr: number[] | undefined, index: number = 0): number | null => {
      if (!arr || !Array.isArray(arr) || arr[index] === undefined || arr[index] === -1) {
        return null;
      }
      return this.convertKeepaPrice(arr[index]);
    };

    return {
      current: getPrice(stats.current),
      avg30: getPrice(stats.avg30),
      avg90: getPrice(stats.avg90),
      avg180: getPrice(stats.avg180),
      min30: getPrice(stats.min30),
      min90: getPrice(stats.min90),
      min180: getPrice(stats.min180),
      max30: getPrice(stats.max30),
      max90: getPrice(stats.max90),
      max180: getPrice(stats.max180)
    };
  }

  private processKeepaHistory(csvData: any): { date: string; price: number }[] {
    if (!csvData || !Array.isArray(csvData[0])) return [];

    const result = [];
    const prices = csvData[0]; // Amazon price history

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 180);

    for (let i = 0; i < prices.length; i += 2) {
      const timestamp = prices[i];
      const price = prices[i + 1];

      if (timestamp && price && price !== -1) {
        const date = new Date(timestamp * 60000);
        if (date >= cutoffDate) {
          const convertedPrice = this.convertKeepaPrice(price);
          if (convertedPrice !== null) {
            result.push({
              date: date.toISOString(),
              price: convertedPrice
            });
          }
        }
      }
    }

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private convertKeepaPrice(keepaPrice: number): number | null {
    if (typeof keepaPrice !== 'number' || keepaPrice === -1) return null;
    return Number((keepaPrice / 100).toFixed(2));
  }

  private getProductImage(product: any): string {
    if (!product.imagesCSV) {
      return 'https://via.placeholder.com/300?text=No+Image';
    }
    const imageId = product.imagesCSV.split(',')[0];
    return `https://images-na.ssl-images-amazon.com/images/I/${imageId}`;
  }
}

export const keepaService = new KeepaService();