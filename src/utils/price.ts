// src/utils/price.ts
export function formatPrice(price: number | null): string {
  if (price === null) return 'N/A';
  return new Intl.NumberFormat('en-EN', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-EN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export function getPriceColor(current: number | null, comparison: number | null): string {
  if (!current || !comparison) return 'text-slate-600';
  
  const diff = ((current - comparison) / comparison) * 100;
  
  if (diff <= -5) return 'text-green-600';
  if (diff >= 5) return 'text-red-600';
  return 'text-slate-600';
}

export function getPriceStatus(current: number | null, comparison: number | null): string {
  if (!current || !comparison) return '';
  
  const diff = ((current - comparison) / comparison) * 100;
  const diffAbs = Math.abs(diff);
  
  if (diff <= -5) {
    return `%${diffAbs.toFixed(1)}  more convenient`;
  }
  if (diff >= 5) {
    return `%${diffAbs.toFixed(1)} more expensive`;
  }
  return 'At the average price';
}