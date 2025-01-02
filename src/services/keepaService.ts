// src/services/keepaService.ts
import axios from 'axios';

export interface KeepaProduct {
  asin: string;
  title: string;
  currentPrice: number | null;
  previousPrice: number | null;
  imageUrl: string;
  lastUpdated: string;
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
      const response = await axios.get(this.baseUrl, {
        params: {
          key: this.apiKey,
          domain: 1,
          asin: asin,
          stats: 90,
          offers: 1, // Satıcı tekliflerini de al
          priceTypes: ['1', '2', '3'], // Farklı fiyat tiplerini al
          history: true
        }
      });

      const data = response.data;

      if (data.error) {
        throw new Error(data.error.message || 'Keepa API hatası');
      }

      if (!data.products || data.products.length === 0) {
        throw new Error('Ürün bulunamadı');
      }

      const product = data.products[0];
      const priceHistory = this.processKeepaHistory(product.csv);
      const currentPriceData = this.getCurrentPrice(product);

      return {
        asin: product.asin,
        title: product.title,
        currentPrice: currentPriceData.current,
        previousPrice: currentPriceData.previous,
        imageUrl: this.getProductImage(product),
        lastUpdated: new Date(product.lastUpdate * 1000).toISOString(),
        priceHistory,
        stats: this.calculateStats(priceHistory)
      };
    } catch (error) {
      console.error('Keepa API Error:', error);
      throw error;
    }
  }

  private getCurrentPrice(product: any): { current: number | null; previous: number | null } {
    let current = null;
    let previous = null;

    // Amazon fiyatı
    if (product.stats?.current) {
      current = this.convertKeepaPrice(product.stats.current);
    }

    // Yeni satıcı fiyatı
    if (current === null && product.stats?.newPrice) {
      current = this.convertKeepaPrice(product.stats.newPrice);
    }

    // Liste fiyatı
    if (product.stats?.listPrice) {
      previous = this.convertKeepaPrice(product.stats.listPrice);
    }

    // Ortalama fiyat
    if (previous === null && product.stats?.avg) {
      previous = this.convertKeepaPrice(product.stats.avg);
    }

    return { current, previous };
  }

  private convertKeepaPrice(keepaPrice: number): number | null {
    if (!keepaPrice || keepaPrice === -1) return null;
    return Number((keepaPrice / 100).toFixed(2));
  }

  private processKeepaHistory(csvData: any): { date: string; price: number }[] {
    if (!csvData || !Array.isArray(csvData[0])) return [];

    const result: { date: string; price: number }[] = [];
    const amazonPrices = csvData[0]; // Amazon fiyat geçmişi
    const newPrices = csvData[1]; // Yeni satıcı fiyat geçmişi

    for (let i = 0; i < amazonPrices.length; i += 2) {
      const timestamp = amazonPrices[i];
      let price = amazonPrices[i + 1];

      // Amazon fiyatı yoksa yeni satıcı fiyatını kullan
      if (price === -1 && newPrices && newPrices[i + 1] !== -1) {
        price = newPrices[i + 1];
      }

      if (timestamp && price && price !== -1) {
        const convertedPrice = this.convertKeepaPrice(price);
        if (convertedPrice !== null) {
          result.push({
            date: new Date(timestamp * 60000).toISOString(),
            price: convertedPrice
          });
        }
      }
    }

    return result;
  }

  private calculateStats(priceHistory: { date: string; price: number }[]): {
    lowestPrice: number | null;
    highestPrice: number | null;
    averagePrice: number | null;
  } {
    if (priceHistory.length === 0) {
      return {
        lowestPrice: null,
        highestPrice: null,
        averagePrice: null
      };
    }

    const prices = priceHistory.map(h => h.price);
    const sum = prices.reduce((a, b) => a + b, 0);

    return {
      lowestPrice: Math.min(...prices),
      highestPrice: Math.max(...prices),
      averagePrice: Number((sum / prices.length).toFixed(2))
    };
  }

  private getProductImage(product: any): string {
    if (!product.imagesCSV) return '';
    const imageId = product.imagesCSV.split(',')[0];
    return `https://images-na.ssl-images-amazon.com/images/I/${imageId}`;
  }
}

export const keepaService = new KeepaService();