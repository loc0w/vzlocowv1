// src/components/dashboard/Scanner.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  Search, 
  ArrowRight, 
  Star, 
  ExternalLink, 
  AlertCircle,
  Upload,
  Camera,
  Keyboard,
  X,
  BarChart4,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Check
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
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Chart.js kayıt
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

// Input metodları
type InputMethod = 'manual' | 'camera' | 'upload';

// Test ürün verisi
const TEST_PRODUCT = {
  asin: 'B0CHX3QBCH',
  title: "Apple USB-C to USB-C Charge Cable (2m)",
  currentPrice: 19.99,
  previousPrice: 24.99,
  imageUrl: "https://m.media-amazon.com/images/I/411aTMUWgPL._AC_SL1000_.jpg",
  lastUpdated: new Date().toISOString(),
  priceHistory: [
    { date: '2024-01-01', price: 24.99 },
    { date: '2024-01-02', price: 22.99 },
    { date: '2024-01-03', price: 21.99 },
    { date: '2024-01-04', price: 23.99 },
    { date: '2024-01-05', price: 20.99 },
    { date: '2024-01-06', price: 19.99 }
  ],
  stats: {
    lowestPrice: 19.99,
    highestPrice: 24.99,
    averagePrice: 22.49
  }
};

export default function Scanner() {
  const [inputMethod, setInputMethod] = useState<InputMethod>('manual');
  const [scanning, setScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [productData, setProductData] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const scannerRef = useRef<any>(null);
  
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    onDrop: handleImageDrop
  });

  // Chart data
  const chartData = {
    labels: productData?.priceHistory.map((h: any) => 
      new Date(h.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })
    ) || [],
    datasets: [
      {
        label: 'Fiyat Değişimi',
        data: productData?.priceHistory.map((h: any) => h.price) || [],
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
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'white',
        titleColor: 'rgb(51, 65, 85)',
        bodyColor: 'rgb(71, 85, 105)',
        borderColor: 'rgb(226, 232, 240)',
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
            return `$${context.raw.toFixed(2)}`;
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
          minRotation: isMobile ? 45 : 0,
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
          callback: function(value: any) {
            return '$' + value;
          },
          font: {
            size: isMobile ? 10 : 12
          },
          color: 'rgb(100, 116, 139)'
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };
    // Dosya yükleme işlemi
    async function handleImageDrop(acceptedFiles: File[]) {
        if (acceptedFiles.length === 0) return;
        
        setScanning(true);
        setError(null);
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          await processCode(TEST_PRODUCT.asin);
        } catch (err) {
          setError('Görüntüden barkod okunamadı. Lütfen tekrar deneyin.');
        } finally {
          setScanning(false);
        }
      }
    
      // Kamera tarama başlatma
      function startScanner() {
        if (scannerRef.current) return;
    
        scannerRef.current = new Html5QrcodeScanner(
          "reader",
          { 
            fps: 10, 
            qrbox: isMobile ? { width: 250, height: 250 } : { width: 300, height: 300 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
            videoConstraints: {
              facingMode: "environment"
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
            console.log(error);
          }
        );
      }
    
      // Kamera tarama durdurma
      function stopScanner() {
        if (!scannerRef.current) return;
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    
      // Input metodu değiştirme
      function changeInputMethod(method: InputMethod) {
        if (method === 'camera') {
          setInputMethod(method);
          setTimeout(startScanner, 100);
        } else {
          stopScanner();
          setInputMethod(method);
        }
        setShowResults(false);
        setError(null);
        setSuccess(null);
      }
    
      const processCode = async (code: string) => {
        setScanning(true);
        setError(null);
        setSuccess(null);
    
        try {
          if (!code.match(/^[A-Z0-9]{10}$/)) {
            throw new Error('Geçersiz ASIN formatı. Lütfen doğru bir ASIN girin.');
          }
    
          if (code === TEST_PRODUCT.asin) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setProductData(TEST_PRODUCT);
            setSuccess(`Ürün bulundu: ${TEST_PRODUCT.title}`);
            setManualInput('');
            setShowResults(true);
            return;
          }
    
          throw new Error('Bu ASIN için ürün bulunamadı. Lütfen test ASIN kullanın: B0CHX3QBCH');
    
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Bir hata oluştu');
          setProductData(null);
        } finally {
          setScanning(false);
        }
      };
    
      const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualInput.trim()) return;
        await processCode(manualInput.trim().toUpperCase());
      };
    
      useEffect(() => {
        return () => {
          stopScanner();
        };
      }, []);
    
      return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Input Section */}
          {(!showResults || !isMobile) && (
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="max-w-2xl mx-auto">
                {/* Method Tabs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {['manual', 'camera', 'upload'].map((method) => (
                    <button
                      key={method}
                      onClick={() => changeInputMethod(method as InputMethod)}
                      className={`
                        flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl
                        transition-all duration-300 font-medium
                        ${inputMethod === method 
                          ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]' 
                          : 'bg-slate-100/50 hover:bg-slate-100 text-slate-600'}
                      `}
                    >
                      {method === 'manual' && <Keyboard className="w-5 h-5" />}
                      {method === 'camera' && <Camera className="w-5 h-5" />}
                      {method === 'upload' && <Upload className="w-5 h-5" />}
                      <span className="capitalize">
                        {method === 'manual' ? 'ASIN Gir' : method}
                      </span>
                    </button>
                  ))}
                </div>
    
                <div className="mt-6">
                  {inputMethod === 'manual' && (
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                      <div className="relative">
                        <input 
                          type="text"
                          value={manualInput}
                          onChange={(e) => setManualInput(e.target.value)}
                          placeholder="Amazon ASIN girin (Test: B0CHX3QBCH)"
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
                          ${scanning || !manualInput.trim()
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5'}
                        `}
                        disabled={scanning || !manualInput.trim()}
                      >
                        {scanning ? (
                          <span className="loading loading-spinner"></span>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <span>Ürünü Analiz Et</span>
                            <BarChart4 className="w-5 h-5" />
                          </div>
                        )}
                      </button>
                    </form>
                  )}
    
                  {inputMethod === 'camera' && (
                    <div className="relative rounded-2xl overflow-hidden bg-slate-100/50">
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
    
                  {inputMethod === 'upload' && (
                    <div 
                      {...getRootProps()} 
                      className={`
                        border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer
                        transition-all duration-300
                        ${isDragActive 
                          ? 'border-primary bg-primary/5' 
                          : 'border-slate-200 hover:border-primary/50 bg-slate-100/50'}
                      `}
                    >
                      <input {...getInputProps()} />
                      <div className="space-y-4">
                        <div className={`
                          w-16 h-16 rounded-2xl mx-auto flex items-center justify-center
                          transition-all duration-300
                          ${isDragActive ? 'bg-primary/10' : 'bg-slate-200'}
                        `}>
                          <Upload className={`w-8 h-8 ${isDragActive ? 'text-primary' : 'text-slate-400'}`} />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-slate-700">
                            {isDragActive ? "Dosyayı Bırakın" : "Barkod Görselini Yükleyin"}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            PNG, JPG veya JPEG. Maksimum 5MB.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
    
          {/* Alerts */}
          {(error || success) && (
            <div className={`
              fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96
              transition-all duration-500 transform
              ${error || success ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-2xl shadow-lg border border-red-100
                  flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="ml-auto p-1 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-2xl shadow-lg border border-green-100
                  flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <p>{success}</p>
                  <button 
                    onClick={() => setSuccess(null)}
                    className="ml-auto p-1 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
    
          {/* Results Section */}
          {productData && (!isMobile || showResults) && (
            <div className="space-y-6">
              {/* Product Card */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Product Image */}
                  <div className="w-full sm:w-48 h-48 bg-slate-100/50 rounded-2xl p-4
                    flex items-center justify-center">
                    <img 
                      src={productData.imageUrl} 
                      alt={productData.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
    
                  {/* Product Info */}
                  <div className="flex-1 space-y-4">
                    <h2 className="text-2xl font-bold text-slate-800">{productData.title}</h2>
                    
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="text-3xl font-bold text-primary">
                        ${productData.currentPrice}
                      </span>
                      <span className="text-xl line-through text-slate-400">
                        ${productData.previousPrice}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                        text-sm font-medium bg-green-100 text-green-700">
                        <ArrowDownRight className="w-4 h-4" />
                        {(((productData.previousPrice - productData.currentPrice) / productData.previousPrice) * 100).toFixed(1)}%
                      </span>
                    </div>
    
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                        bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium
                        transition-all duration-300">
                        <Star className="w-5 h-5" />
                        Takip Et
                      </button>
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
                        Amazon'da Gör
                      </a>
                    </div>
                  </div>
                </div>
              </div>
    
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: 'En Düşük Fiyat',
                    value: productData.stats.lowestPrice,
                    color: 'text-green-600',
                    bg: 'bg-green-100'
                  },
                  {
                    title: 'En Yüksek Fiyat',
                    value: productData.stats.highestPrice,
                    color: 'text-red-600',
                    bg: 'bg-red-100'
                  },
                  {
                    title: 'Ortalama Fiyat',
                    value: productData.stats.averagePrice,
                    color: 'text-primary',
                    bg: 'bg-primary/10'
                  }
                ].map((stat, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="text-sm text-slate-600">{stat.title}</div>
                    <div className={`text-2xl font-bold mt-1 ${stat.color}`}>
                      ${stat.value}
                    </div>
                  </div>
                ))}
              </div>
    
              {/* Price Chart */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Fiyat Grafiği</h3>
                <div className="h-[400px]">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
    
              {/* Price History */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800">Fiyat Geçmişi</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Tarih</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Fiyat</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Değişim</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.priceHistory.map((history: any, index: number) => {
                        const prevPrice = index > 0 ? productData.priceHistory[index - 1].price : history.price;
                        const change = history.price - prevPrice;
                        return (
                          <tr key={index} className="border-t border-slate-100 hover:bg-slate-50/50">
                            <td className="py-4 px-6 text-slate-600">
                              {new Date(history.date).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="py-4 px-6 font-medium text-slate-800">
                              ${history.price}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`
                                inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium
                                ${change === 0 
                                  ? 'bg-slate-100 text-slate-600' 
                                  : change < 0 
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }
                              `}>
                                {change === 0 ? (
                                  '-'
                                ) : change < 0 ? (
                                  <>
                                    <ArrowDownRight className="w-4 h-4" />
                                    ${Math.abs(change).toFixed(2)}
                                  </>
                                ) : (
                                  <>
                                    <ArrowUpRight className="w-4 h-4" />
                                    ${change.toFixed(2)}
                                  </>
                                )}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }