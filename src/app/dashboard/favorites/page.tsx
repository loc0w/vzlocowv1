'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import axios from 'axios';
import {
  Heart,
  BarChart4,
  TrendingDown,
  TrendingUp,
  DollarSign,
  ExternalLink,
  Info,
  Search,
  X,
  AlertCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { formatPrice, formatDate, getPriceColor } from '@/utils/price';

// Types
export interface PriceHistory {
  date: string;
  price: number;
}

export interface PriceStats {
  avg90: number | null;
  min90: number | null;
  max90: number | null;
}

export interface Favorite {
  asin: string;
  title: string;
  imageUrl: string;
  currentPrice: number;
  lastUpdate: string;
  priceHistory: PriceHistory[];
  stats: PriceStats;
}

// Chart.js register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceStatProps {
  title: string;
  value: number | null;
  comparison?: number | null;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  period?: string;
  info?: string;
}

const PriceStat: React.FC<PriceStatProps> = ({
  title,
  value,
  comparison,
  icon,
  trend,
  period,
  info
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const priceColor = getPriceColor(value, comparison);

  if (value === null) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          {icon}
          <span>{title}</span>
          {info && (
            <button
              className="text-slate-400 hover:text-slate-600 transition-colors"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="w-4 h-4" />
            </button>
          )}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium rounded-full px-2 py-1
            ${
              trend === 'down'
                ? 'bg-green-100 text-green-700'
                : trend === 'up'
                ? 'bg-red-100 text-red-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'neutral' && <BarChart4 className="w-3 h-3" />}
            {period}
          </div>
        )}
      </div>
      <div className={`text-2xl font-bold mt-2 ${priceColor}`}>
        {formatPrice(value)}
      </div>
      {showInfo && info && (
        <div className="absolute bottom-full left-0 w-full p-3 bg-white rounded-lg shadow-lg border border-slate-200 text-sm text-slate-600 mb-2 z-10">
          {info}
        </div>
      )}
    </div>
  );
};

const ProductCard: React.FC<{
  product: Favorite;
  onRemove: (asin: string) => void;
  onSelect: (product: Favorite) => void;
  isSelected: boolean;
}> = ({ product, onRemove, onSelect, isSelected }) => (
  <div 
    className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
      ${isSelected ? 'ring-2 ring-primary' : ''}`}
    onClick={() => onSelect(product)}
  >
    <div className="p-4 flex gap-4">
      <div className="w-24 h-24 bg-slate-100/50 rounded-xl p-2 flex items-center justify-center">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-slate-800 truncate">{product.title}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(product.asin);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>
        </div>
        
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.currentPrice)}
          </span>
          {product.stats.avg90 !== null && (
            <span className={`text-sm ${getPriceColor(product.currentPrice, product.stats.avg90)}`}>
              vs. 90-Day Avg: {formatPrice(product.stats.avg90)}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default function Favorites() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Favorite | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Load favorites
  useEffect(() => {
    const loadFavorites = async () => {
      if (status === 'authenticated') {
        try {
          const response = await axios.get('/api/favorites');
          setFavorites(response.data);
          if (response.data.length > 0) {
            setSelectedProduct(response.data[0]);
          }
        } catch (err) {
          console.error('Load favorites error:', err);
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.error || 'Failed to load favorites');
          } else {
            setError('Failed to load favorites');
          }
        }
      }
    };
    loadFavorites();
  }, [status]);

  // Remove from favorites
  const removeFavorite = async (asin: string) => {
    try {
      await axios.delete(`/api/favorites/${asin}`);
      setFavorites((prev) => prev.filter((f) => f.asin !== asin));
      if (selectedProduct?.asin === asin) {
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error('Remove favorite error:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to remove from favorites');
      } else {
        setError('Failed to remove from favorites');
      }
    }
  };

  // Filter favorites based on search
  const filteredFavorites = favorites.filter((favorite) =>
    favorite.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chart data & options for selected product
  const chartData = {
    labels: selectedProduct?.priceHistory.map((h) => formatDate(h.date)) || [],
    datasets: [
      {
        label: 'Price',
        data: selectedProduct?.priceHistory.map((h) => h.price) || [],
        borderColor: '#6366f1',
        backgroundColor: '#6366f120',
        fill: true,
        tension: 0.4,
        pointRadius: isMobile ? 3 : 5,
        pointHoverRadius: isMobile ? 5 : 8,
        borderWidth: 2
      },
      {
        label: '90-Day Average',
        data: Array(selectedProduct?.priceHistory.length).fill(selectedProduct?.stats.avg90 || 0),
        borderColor: '#eab308',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#ffffff',
        titleColor: '#334155',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 14
        },
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatPrice(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: isMobile ? 45 : 0,
          font: {
            size: isMobile ? 10 : 12
          },
          color: '#64748b'
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: '#f1f5f9'
        },
        ticks: {
          callback: function(value: any) {
            return formatPrice(value);
          },
          font: {
            size: isMobile ? 10 : 12
          },
          color: '#64748b'
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center justify-center space-x-2 animate-pulse">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <div className="w-2 h-2 bg-primary rounded-full animation-delay-200"></div>
          <div className="w-2 h-2 bg-primary rounded-full animation-delay-400"></div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Please Sign In
          </h2>
          <p className="text-slate-600 mb-6">
            You need to be signed in to view and manage your favorites.
          </p>
          <button
            onClick={() => signIn()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
              bg-primary text-white font-medium shadow-lg shadow-primary/25
              hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5
              transition-all duration-300"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">My Favorites</h1>
          
          {/* Search */}
          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search favorites..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-white shadow-lg
                border-2 border-transparent focus:border-primary/20 outline-none
                transition-all duration-300"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              No Favorites Yet
            </h2>
            <p className="text-slate-600">
              Start adding products to your favorites to track their prices.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Favorites List */}
            <div className="lg:col-span-1 space-y-4">
              {filteredFavorites.map((favorite) => (
                <ProductCard
                  key={favorite.asin}
                  product={favorite}
                  onRemove={removeFavorite}
                  onSelect={setSelectedProduct}
                  isSelected={selectedProduct?.asin === favorite.asin}
                />
              ))}
            </div>

            {/* Selected Product Details */}
            {selectedProduct && (
              <div className="lg:col-span-2 space-y-6">
                {/* Price Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Current Price */}
                  <PriceStat
                    title="Current Price"
                    value={selectedProduct.currentPrice}
                    comparison={selectedProduct.stats.avg90}
                    icon={<DollarSign className="w-4 h-4" />}
                    info="The current selling price of this product."
                  />

                  {/* 90-Day Average */}
                  <PriceStat
                    title="90-Day Average"
                    value={selectedProduct.stats.avg90}
                    icon={<BarChart4 className="w-4 h-4 text-blue-500" />}
                    trend="neutral"
                    period="90 days"
                    info="The average price over the last 90 days."
                  />

                  {/* 90-Day Low */}
                  <PriceStat
                    title="90-Day Low"
                    value={selectedProduct.stats.min90}
                    icon={<TrendingDown className="w-4 h-4 text-green-500" />}
                    trend="down"
                    period="90 days"
                    info="Lowest price over the last 90 days."
                  />

                  {/* 90-Day High */}
                  <PriceStat
                    title="90-Day High"
                    value={selectedProduct.stats.max90}
                    icon={<TrendingUp className="w-4 h-4 text-red-500" />}
                    trend="up"
                    period="90 days"
                    info="Highest price over the last 90 days."
                  />
                </div>

                {/* Detailed Product Info */}
                <div className="bg-white rounded-3xl shadow-xl">
                  {/* Product Header */}
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-start gap-6">
                      <div className="w-32 h-32 bg-slate-100/50 rounded-xl p-3 flex items-center justify-center flex-shrink-0">
                        <img
                          src={selectedProduct.imageUrl}
                          alt={selectedProduct.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-800 mb-3">
                          {selectedProduct.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(selectedProduct.currentPrice)}
                          </span>
                          {selectedProduct.stats.avg90 && (
                            <span className={`text-sm font-medium ${getPriceColor(selectedProduct.currentPrice, selectedProduct.stats.avg90)}`}>
                              {selectedProduct.currentPrice < selectedProduct.stats.avg90 ? 'Below' : 'Above'} Average Price
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                          <div className="text-sm text-slate-500">
                            Last update: {formatDate(selectedProduct.lastUpdate)}
                          </div>
                          <a
                            href={`https://www.amazon.com/dp/${selectedProduct.asin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                              bg-primary text-white text-sm font-medium
                              hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5
                              transition-all duration-300"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View on Amazon
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Analysis */}
                  {selectedProduct.stats.avg90 && (
                    <div className="p-6 bg-slate-50/50 rounded-b-3xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Current vs Average</div>
                          <div className={`text-xl font-bold ${selectedProduct.currentPrice < selectedProduct.stats.avg90 ? 'text-green-600' : 'text-red-600'}`}>
                            {((selectedProduct.currentPrice - selectedProduct.stats.avg90) / selectedProduct.stats.avg90 * 100).toFixed(1)}%
                            <span className="text-sm font-medium text-slate-600 ml-2">
                              ({formatPrice(Math.abs(selectedProduct.currentPrice - selectedProduct.stats.avg90))} {selectedProduct.currentPrice > selectedProduct.stats.avg90 ? 'more' : 'less'})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50">
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl shadow-lg border border-red-100 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto p-1 hover:bg-red-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}