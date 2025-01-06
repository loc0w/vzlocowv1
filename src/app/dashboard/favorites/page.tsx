'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import axios from 'axios';
import {
  Heart, BarChart4, TrendingDown, TrendingUp, DollarSign,
  ExternalLink, Info, Search, X, AlertCircle, ArrowLeft, ArrowRight
} from 'lucide-react';
import { formatPrice, getPriceColor } from '@/utils/price';

// Types remain the same
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
  stats: PriceStats;
}

const ProductCard = ({ product, onRemove, onSelect, isSelected }) => (
  <div 
    className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
      ${isSelected ? 'ring-2 ring-primary' : ''}`}
    onClick={() => onSelect(product)}
  >
    <div className="p-4 sm:p-6">
      <div className="flex gap-4 sm:gap-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100/50 rounded-xl p-2 flex items-center justify-center flex-shrink-0">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-800 text-base sm:text-lg line-clamp-2">{product.title}</h3>
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
          
          <div className="mt-2 sm:mt-3">
            <div className="flex items-baseline gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {formatPrice(product.currentPrice)}
              </span>
              {product.stats.avg90 && (
                <div className="flex items-center gap-1.5">
                  <span className={`text-sm font-medium ${product.currentPrice < product.stats.avg90 ? 'text-green-600' : 'text-red-600'}`}>
                    {((product.currentPrice - product.stats.avg90) / product.stats.avg90 * 100).toFixed(1)}%
                  </span>
                  <span className="text-sm text-slate-500">vs avg</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 sm:mt-4 hidden sm:block">
            <div className="flex flex-wrap gap-3 text-sm">
              {product.stats.min90 && (
                <div className="flex items-center gap-1.5 text-green-600">
                  <TrendingDown className="w-4 h-4" />
                  <span>Low: {formatPrice(product.stats.min90)}</span>
                </div>
              )}
              {product.stats.max90 && (
                <div className="flex items-center gap-1.5 text-red-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>High: {formatPrice(product.stats.max90)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex items-center justify-between">
            <div className="text-xs sm:text-sm text-slate-500 flex items-center gap-1">
              {product.stats.min90 && product.currentPrice === product.stats.min90 && (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingDown className="w-3 h-3" />
                  Best Price Now
                </div>
              )}
            </div>
            <a
              href={`https://www.amazon.com/dp/${product.asin}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              View on Amazon
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProductDetails = ({ product }) => (
  <div className="bg-white rounded-3xl shadow-xl">
    <div className="p-4 sm:p-6 border-b border-slate-100">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="w-full sm:w-32 h-48 sm:h-32 bg-slate-100/50 rounded-xl p-3 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">
            {product.title}
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(product.currentPrice)}
            </span>
            {product.stats.avg90 && (
              <span className={`text-sm font-medium ${getPriceColor(product.currentPrice, product.stats.avg90)}`}>
                {product.currentPrice < product.stats.avg90 ? 'Below' : 'Above'} Average Price
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <a
              href={`https://www.amazon.com/dp/${product.asin}`}
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

    {product.stats.avg90 && (
      <div className="p-4 sm:p-6 bg-slate-50/50 rounded-b-3xl">
        <div className="space-y-4">
          <div>
            <div className="text-sm text-slate-500 mb-1">Current vs Average</div>
            <div className={`text-lg sm:text-xl font-bold ${product.currentPrice < product.stats.avg90 ? 'text-green-600' : 'text-red-600'}`}>
              {((product.currentPrice - product.stats.avg90) / product.stats.avg90 * 100).toFixed(1)}%
              <span className="text-sm font-medium text-slate-600 ml-2">
                ({formatPrice(Math.abs(product.currentPrice - product.stats.avg90))} {product.currentPrice > product.stats.avg90 ? 'more' : 'less'})
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <div className="text-sm text-slate-500 mb-1">Current Price</div>
              <div className="text-base sm:text-lg font-semibold text-slate-800">
                {formatPrice(product.currentPrice)}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Average Price</div>
              <div className="text-base sm:text-lg font-semibold text-slate-800">
                {formatPrice(product.stats.avg90)}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Price Changes</div>
              <div className="text-base sm:text-lg font-semibold text-slate-800">
                Last 90 days
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default function Favorites() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Favorite | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const loadFavorites = async () => {
      if (status === 'authenticated') {
        try {
          const response = await axios.get('/api/favorites');
          const sortedFavorites = response.data.sort((a: Favorite, b: Favorite) => 
            new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
          );
          setFavorites(sortedFavorites);
          if (sortedFavorites.length > 0) {
            setSelectedProduct(sortedFavorites[0]);
          }
        } catch (err) {
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

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const filteredFavorites = favorites.filter((favorite) =>
    favorite.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFavorites.length / itemsPerPage);
  const currentItems = filteredFavorites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeFavorite = async (asin: string) => {
    try {
      await axios.delete(`/api/favorites/${asin}`);
      setFavorites((prev) => prev.filter((f) => f.asin !== asin));
      if (selectedProduct?.asin === asin) {
        setSelectedProduct(null);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to remove from favorites');
      } else {
        setError('Failed to remove from favorites');
      }
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">My Favorites</h1>
          
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
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
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
            <div className="space-y-4">
              {currentItems.map((favorite) => (
                <ProductCard
                  key={favorite.asin}
                  product={favorite}
                  onRemove={removeFavorite}
                  onSelect={setSelectedProduct}
                  isSelected={selectedProduct?.asin === favorite.asin}
                />
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 bg-white p-4 rounded-2xl shadow-lg overflow-x-auto">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
                      currentPage === 1 
                        ? 'text-slate-300' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0
                        ${currentPage === page 
                          ? 'bg-primary text-white font-medium shadow-lg shadow-primary/25' 
                          : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
                      currentPage === totalPages 
                        ? 'text-slate-300' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Selected Product Details - Desktop */}
            {selectedProduct && (
              <div className="lg:col-span-2">
                <ProductDetails product={selectedProduct} />
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