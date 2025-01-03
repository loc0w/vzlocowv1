// src/utils/price.ts

export const formatPrice = (price: number | null): string => {
    if (price === null) return 'N/A';
    return `$${price.toFixed(2)}`;
  };
  
  export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  export const calculatePriceChange = (current: number | null, previous: number | null): number | null => {
    if (!current || !previous) return null;
    return ((previous - current) / previous) * 100;
  };
  
  export const getPriceColor = (current: number | null, average: number | null): string => {
    if (!current || !average) return 'text-slate-600';
    return current < average ? 'text-green-600' : 'text-red-600';
  };
  
  export const getPriceStatus = (current: number | null, average: number | null): string => {
    if (!current || !average) return 'Veri yok';
    const diff = ((current - average) / average) * 100;
    if (Math.abs(diff) < 1) return 'Ortalama fiyatta';
    return `${Math.abs(diff).toFixed(1)}% ${current < average ? 'daha düşük' : 'daha yüksek'}`;
  };