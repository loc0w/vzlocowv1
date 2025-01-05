'use client';

import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import {
  Search,
  ExternalLink,
  AlertCircle,
  Upload,
  Camera,
  Keyboard,
  X,
  BarChart4,
  Heart,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Info,
  Check,
  ChevronLeft
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
import { formatPrice, formatDate, getPriceColor, getPriceStatus } from '@/utils/price';

// Types
import type { KeepaProduct } from '@/types/keepa';
import type { Favorite } from '@/types/favorite';

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

type InputMethod = 'manual' | 'camera' | 'upload';

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
  const status = comparison ? getPriceStatus(value, comparison) : null;

  if (value === null) {
    // Değer yoksa stat kutusunu hiç göstermeyin.
    return null;
  }

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
      {status && (
        <div className="text-sm mt-1 text-slate-500">
          {status}
        </div>
      )}
      {showInfo && info && (
        <div
          className="absolute bottom-full left-0 w-full p-3 bg-white rounded-lg shadow-lg
          border border-slate-200 text-sm text-slate-600 mb-2 z-10"
        >
          {info}
        </div>
      )}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2 animate-pulse">
    <div className="w-2 h-2 bg-primary rounded-full"></div>
    <div className="w-2 h-2 bg-primary rounded-full animation-delay-200"></div>
    <div className="w-2 h-2 bg-primary rounded-full animation-delay-400"></div>
  </div>
);

const ErrorAlert: React.FC<{ message: string; onClose: () => void }> = ({
  message,
  onClose
}) => (
  <div
    className="bg-red-50 text-red-700 p-4 rounded-2xl shadow-lg border border-red-100
    flex items-center gap-3"
  >
    <AlertCircle className="w-5 h-5 flex-shrink-0" />
    <p>{message}</p>
    <button
      onClick={onClose}
      className="ml-auto p-1 hover:bg-red-100 rounded-lg transition-colors"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

const SuccessAlert: React.FC<{ message: string; onClose: () => void }> = ({
  message,
  onClose
}) => (
  <div
    className="bg-green-50 text-green-700 p-4 rounded-2xl shadow-lg border border-green-100
    flex items-center gap-3"
  >
    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
      <Check className="w-3 h-3" />
    </div>
    <p>{message}</p>
    <button
      onClick={onClose}
      className="ml-auto p-1 hover:bg-green-100 rounded-lg transition-colors"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

export default function Scanner() {
  const { data: session, status } = useSession();
  const [inputMethod, setInputMethod] = useState<InputMethod>('manual');
  const [scanning, setScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [productData, setProductData] = useState<KeepaProduct | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [showResults, setShowResults] = useState(false);
  const scannerRef = useRef<any>(null);

  // Ekran boyutuna göre tarayıcı ayarları
  const isMobile = useMediaQuery('(max-width: 768px)');

  // CHART.JS: Chart data
  const chartData: ChartData<'line'> = {
    labels: productData?.priceHistory.map((h) => formatDate(h.date)) || [],
    datasets: [
      {
        label: 'Price',
        data: productData?.priceHistory.map((h) => h.price) || [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: isMobile ? 3 : 5,
        pointHoverRadius: isMobile ? 5 : 8,
        borderWidth: 2
      },
      {
        label: '90-Day Average',
        data:
          productData?.priceHistory.map(() => productData.stats.avg90 || 0) ||
          [],
        borderColor: 'rgba(234, 179, 8, 0.5)',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'white',
        titleColor: 'rgb(51, 65, 85)',
        bodyColor: 'rgb(71, 85, 105)',
        borderColor: 'rgb(226, 232, 240)',
        borderWidth: 1,
        padding: 12,
        bodyFont: { size: 14 },
        titleFont: { size: 14, weight: 'bold' },
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `Price: ${formatPrice(context.raw as number)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          maxRotation: isMobile ? 45 : 0,
          font: {
            size: isMobile ? 10 : 12
          },
          color: 'rgb(100, 116, 139)'
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgb(241, 245, 249)'
        },
        ticks: {
          callback: (value) => formatPrice(value as number),
          font: {
            size: isMobile ? 10 : 12
          },
          color: 'rgb(100, 116, 139)'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  // FAVORİLERİ YÜKLE
  useEffect(() => {
    const loadFavorites = async () => {
      if (status === 'authenticated') {
        try {
          const response = await axios.get('/api/favorites');
          setFavorites(response.data);
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

  // ÜRÜN FAVORİDE Mİ
  const isProductInFavorites = (asin: string) => {
    return favorites.some((f) => f.asin === asin);
  };

  // FAVORİ EKLE / KALDIR
  const toggleFavorite = async (product: KeepaProduct) => {
    if (status !== 'authenticated') {
      setError('You need to be logged in to manage favorites.');
      return;
    }
    try {
      if (isProductInFavorites(product.asin)) {
        // Favoriden sil
        await axios.delete(`/api/favorites/${product.asin}`);
        setFavorites((prev) => prev.filter((f) => f.asin !== product.asin));
        setSuccess('Product removed from favorites.');
      } else {
        // Favoriye ekle
        const response = await axios.post('/api/favorites', {
          asin: product.asin,
          title: product.title,
          imageUrl: product.imageUrl,
          currentPrice: product.currentPrice,
          lastUpdate: product.lastUpdate,
          priceHistory: product.priceHistory,
          stats: product.stats
        });
        setFavorites((prev) => [...prev, response.data]);
        setSuccess('Product added to favorites.');
      }
    } catch (err) {
      console.error('Toggle favorite error:', err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || 'Failed to update favorites.'
        );
      } else {
        setError('Failed to update favorites.');
      }
    }
  };

  // BARKOD / ASIN İŞLEME
  const processCode = async (code: string) => {
    setScanning(true);
    setError(null);
    setSuccess(null);

    try {
      // Ürün bilgilerini çektiğinizi varsayan bir endpoint (örn. /api/products/[asin])
      const response = await axios.get(`/api/products/${code}`);
      setProductData(response.data);
      setSuccess(`Product found: ${response.data.title}`);
      setManualInput('');
      setShowResults(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Product not found.');
      } else {
        setError('An error occurred.');
      }
      setProductData(null);
    } finally {
      setScanning(false);
    }
  };

  // KAMERA TARAMASINI BAŞLAT
  function startScanner() {
    if (scannerRef.current) return; // Tekrar tekrar başlatmayın

    scannerRef.current = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10,
        qrbox: isMobile ? { width: 250, height: 250 } : { width: 300, height: 300 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        videoConstraints: {
          facingMode: 'environment'
        }
      },
      false
    );

    scannerRef.current.render(
      async (decodedText: string) => {
        await processCode(decodedText);
        stopScanner();
      },
      (error: any) => {
        // Kamera okuma hataları
        console.log(error);
      }
    );
  }

  // KAMERA TARAMASINI DURDUR
  function stopScanner() {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
  }

  // GİRİŞ YÖNTEMİNİ DEĞİŞTİR
  function changeInputMethod(method: InputMethod) {
    if (method === 'camera') {
      setInputMethod(method);
      // Biraz gecikmeli başlatalım ki render tamamlansın
      setTimeout(startScanner, 100);
    } else {
      stopScanner();
      setInputMethod(method);
    }
    setShowResults(false);
    setError(null);
    setSuccess(null);
  }

  // DOSYA YÜKLEME (dropzone)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      setScanning(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('image', acceptedFiles[0]);

        // /api/barcode gibi bir endpoint varsa orada resmi işleyip barkod metni döndürüyorsunuz
        const response = await axios.post('/api/barcode', formData);
        // response.data.code içinden barkod ya da ASIN alıp işleyelim:
        await processCode(response.data.code);
      } catch (err) {
        setError('Could not read barcode from the image.');
        setProductData(null);
      } finally {
        setScanning(false);
      }
    }
  });

  // MANUEL ASIN GİRİŞİ
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    await processCode(manualInput.trim().toUpperCase());
  };

  // Bileşen unmount olurken kamera durdur
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Mobilde geri butonu */}
      {isMobile && showResults && (
        <button
          onClick={() => setShowResults(false)}
          className="flex items-center gap-2 text-slate-600 mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      )}

      {/* Giriş Formu/Kutusu (eğer sonuç gösterilmiyorsa veya mobildeysek) */}
      {(!showResults || !isMobile) && (
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="max-w-2xl mx-auto">
            {/* Yöntem Butonları */}
            <div className="flex flex-col sm:flex-row gap-3">
              {[
                { id: 'manual', icon: Keyboard, label: 'Manual' },
                { id: 'camera', icon: Camera, label: 'Camera' },
                { id: 'upload', icon: Upload, label: 'Upload' }
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => changeInputMethod(id as InputMethod)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl
                    transition-all duration-300 font-medium
                    ${
                      inputMethod === id
                        ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]'
                        : 'bg-slate-100/50 hover:bg-slate-100 text-slate-600'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Seçili giriş yöntemine göre içerik */}
            <div className="mt-6">
              {/* MANUEL GİRİŞ */}
              {inputMethod === 'manual' && (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="Enter Amazon ASIN (e.g. B0CHX3QBCH)"
                      className="w-full h-14 pl-14 pr-4 rounded-2xl bg-slate-100/50 focus:bg-white
                        border-2 border-transparent focus:border-primary/20 outline-none
                        transition-all duration-300 text-lg"
                      disabled={scanning}
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  </div>
                  <button
                    type="submit"
                    className={`
                      w-full h-14 rounded-2xl font-medium text-lg
                      transition-all duration-300
                      ${
                        scanning || !manualInput.trim()
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5'
                      }
                    `}
                    disabled={scanning || !manualInput.trim()}
                  >
                    {scanning ? (
                      <LoadingSpinner />
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Analyze Product</span>
                        <BarChart4 className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                </form>
              )}

              {/* KAMERA */}
              {inputMethod === 'camera' && (
                <div className="relative rounded-2xl overflow-hidden bg-slate-100/50">
                  {/* Kamera render edeceğimiz div */}
                  <div id="reader" className="w-full" />
                  <button
                    onClick={() => changeInputMethod('manual')}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl
                      hover:bg-white transition-all duration-300 shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* DOSYA YÜKLEME */}
              {inputMethod === 'upload' && (
                <div
                  {...getRootProps()}
                  className={`
                    border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer
                    transition-all duration-300
                    ${
                      isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-primary/50 bg-slate-100/50'
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    <div
                      className={`
                        w-16 h-16 rounded-2xl mx-auto flex items-center justify-center
                        transition-all duration-300
                        ${isDragActive ? 'bg-primary/10' : 'bg-slate-200'}
                      `}
                    >
                      <Upload
                        className={`
                          w-8 h-8 ${
                            isDragActive ? 'text-primary' : 'text-slate-400'
                          }
                        `}
                      />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-slate-700">
                        {isDragActive ? 'Drop the file' : 'Upload a barcode image'}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        PNG, JPG, or JPEG. Max ~5MB.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hata & Başarı Uyarıları */}
      {(error || success) && (
        <div
          className={`
          fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50
          transition-all duration-500 transform
          ${error || success ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}
        >
          {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
          {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}
        </div>
      )}

      {/* Ürün SONUÇLARI */}
      {productData && (!isMobile || showResults) && (
        <div className="space-y-6">
          {/* Ürün Kartı */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-48 h-48 bg-slate-100/50 rounded-2xl p-4 flex items-center justify-center">
                <img
                  src={productData.imageUrl}
                  alt={productData.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {productData.title}
                  </h2>
                  {/* Favori Butonu */}
                  <button
                    onClick={() => toggleFavorite(productData)}
                    className={`p-2 rounded-xl transition-all duration-300 flex-shrink-0 ${
                      isProductInFavorites(productData.asin)
                        ? 'text-red-500 hover:bg-red-50'
                        : 'text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {isProductInFavorites(productData.asin) ? (
                      <Heart className="w-6 h-6 fill-current" />
                    ) : (
                      <Heart className="w-6 h-6" />
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(productData.currentPrice)}
                  </span>
                  {productData.stats.avg90 !== null && (
                    <span
                      className={`text-sm font-medium ${getPriceColor(
                        productData.currentPrice,
                        productData.stats.avg90
                      )}`}
                    >
                      vs. 90-Day Avg: {formatPrice(productData.stats.avg90)}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={`https://www.amazon.com/dp/${productData.asin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                      bg-primary text-white font-medium shadow-lg shadow-primary/25
                      hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5
                      transition-all duration-300"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View on Amazon
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Fiyat İstatistikleri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Price */}
            {productData.currentPrice !== null && (
              <PriceStat
                title="Current Price"
                value={productData.currentPrice}
                comparison={productData.stats.avg90}
                icon={<DollarSign className="w-4 h-4" />}
                info="The current selling price of this product."
              />
            )}

            {/* 30-Day Low */}
            {productData.stats.min30 !== null && (
              <PriceStat
                title="30-Day Low"
                value={productData.stats.min30}
                icon={<TrendingDown className="w-4 h-4 text-green-500" />}
                trend="down"
                period="30 days"
                info="Lowest price over the last 30 days."
              />
            )}

            {/* 90-Day Low */}
            {productData.stats.min90 !== null && (
              <PriceStat
                title="90-Day Low"
                value={productData.stats.min90}
                icon={<TrendingDown className="w-4 h-4 text-green-500" />}
                trend="down"
                period="90 days"
                info="Lowest price over the last 90 days."
              />
            )}

            {/* 180-Day Low */}
            {productData.stats.min180 !== null && (
              <PriceStat
                title="180-Day Low"
                value={productData.stats.min180}
                icon={<TrendingDown className="w-4 h-4 text-green-500" />}
                trend="down"
                period="180 days"
                info="Lowest price over the last 180 days."
              />
            )}

            {/* 30-Day High */}
            {productData.stats.max30 !== null && (
              <PriceStat
                title="30-Day High"
                value={productData.stats.max30}
                icon={<TrendingUp className="w-4 h-4 text-red-500" />}
                trend="up"
                period="30 days"
                info="Highest price over the last 30 days."
              />
            )}

            {/* 90-Day High */}
            {productData.stats.max90 !== null && (
              <PriceStat
                title="90-Day High"
                value={productData.stats.max90}
                icon={<TrendingUp className="w-4 h-4 text-red-500" />}
                trend="up"
                period="90 days"
                info="Highest price over the last 90 days."
              />
            )}

            {/* 180-Day High */}
            {productData.stats.max180 !== null && (
              <PriceStat
                title="180-Day High"
                value={productData.stats.max180}
                icon={<TrendingUp className="w-4 h-4 text-red-500" />}
                trend="up"
                period="180 days"
                info="Highest price over the last 180 days."
              />
            )}

            {/* 30-Day Average */}
            {productData.stats.avg30 !== null && (
              <PriceStat
                title="30-Day Average"
                value={productData.stats.avg30}
                icon={<BarChart4 className="w-4 h-4 text-blue-500" />}
                trend="neutral"
                period="30 days"
                info="The average price over the last 30 days."
              />
            )}

            {/* 90-Day Average */}
            {productData.stats.avg90 !== null && (
              <PriceStat
                title="90-Day Average"
                value={productData.stats.avg90}
                icon={<BarChart4 className="w-4 h-4 text-blue-500" />}
                trend="neutral"
                period="90 days"
                info="The average price over the last 90 days."
              />
            )}

            {/* 180-Day Average */}
            {productData.stats.avg180 !== null && (
              <PriceStat
                title="180-Day Average"
                value={productData.stats.avg180}
                icon={<BarChart4 className="w-4 h-4 text-blue-500" />}
                trend="neutral"
                period="180 days"
                info="The average price over the last 180 days."
              />
            )}
          </div>

          {/* Fiyat Grafiği */}
          {productData.priceHistory.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Price History Chart</h3>
                <div className="text-sm text-slate-500">
                  Last update: {formatDate(productData.lastUpdate)}
                </div>
              </div>
              <div className="h-[400px]">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
