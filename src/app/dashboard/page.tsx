import { 
  Boxes, 
  ArrowUpRight, 
  ArrowDownRight, 
  Star, 
  TrendingDown, 
  TrendingUp, 
  Target,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="flex-shrink-0 border-b border-slate-100 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent">
                Hoş Geldin, Berk 
              </h1>
              <p className="text-slate-600 mt-1">
                Bugünkü Amazon ürün takip özetin burada.
              </p>
            </div>
            <Link 
              href="/dashboard/scan"
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/90 to-violet-500/90 hover:from-primary hover:to-violet-500 text-white rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Boxes className="w-5 h-5" />
              <span>Yeni Ürün Tara</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Daily Scan Card */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-violet-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-2xl p-6 ring-1 ring-slate-100/80 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary/10 to-violet-500/10 text-primary">
                      Pro Plan
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-600">Günlük Tarama</h3>
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                      5/10
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-gradient-to-r from-primary to-violet-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracked Products Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-slate-100/80 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-600">Takip Edilen</h3>
                  <div className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    12 Ürün
                  </div>
                  <p className="text-sm text-slate-500">Aktif takip ediliyor</p>
                </div>
              </div>

              {/* Price Decrease Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-slate-100/80 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-600">Fiyatı Düşenler</h3>
                  <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                    3 Ürün
                  </div>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                    Son 24 saat
                  </p>
                </div>
              </div>

              {/* Price Increase Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-slate-100/80 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-rose-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-600">Fiyatı Artanlar</h3>
                  <div className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                    5 Ürün
                  </div>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4 text-rose-500" />
                    Son 24 saat
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg ring-1 ring-slate-100/80">
              <div className="p-6">
                <h2 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent mb-6">
                  Hızlı İşlemler
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Quick Action Cards */}
                  <Link href="/dashboard/scan" 
                    className="group relative flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-violet-500/5 hover:from-primary/10 hover:to-violet-500/10 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Boxes className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Yeni Tarama</div>
                      <div className="text-sm text-slate-500">Ürün analizi yap</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </Link>

                  <Link href="/dashboard/favorites" 
                    className="group relative flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 hover:from-amber-500/10 hover:to-orange-500/10 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Star className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Favorilerim</div>
                      <div className="text-sm text-slate-500">Takip listesi</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </Link>

                  <Link href="/dashboard/subscription" 
                    className="group relative flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-500/5 to-purple-500/5 hover:from-violet-500/10 hover:to-purple-500/10 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ArrowUpRight className="w-6 h-6 text-violet-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Pro'ya Yükselt</div>
                      <div className="text-sm text-slate-500">Premium özellikler</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Scans */}
            <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg ring-1 ring-slate-100/80">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent">
                    Son Taramalar
                  </h2>
                  <Link 
                    href="/dashboard/history" 
                    className="group flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    Tümünü Gör
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">Ürün</th>
                        <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">Mevcut Fiyat</th>
                        <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">Değişim</th>
                        <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">Son Güncelleme</th>
                        <th className="text-right py-4 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Example Row 1 */}
                      <tr className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12">
                              <div className="absolute inset-0 bg-slate-100 rounded-xl animate-pulse"></div>
                              <img 
                                src="/product-1.jpg" 
                                alt="iPhone" 
                                className="absolute inset-0 w-full h-full object-cover rounded-xl"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">iPhone 13 Pro</div>
                              <div className="text-sm text-slate-500">Apple</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-slate-800">$999.99</div>
                          <div className="text-sm text-slate-500">Amazon.com</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-500">
                            <ArrowDownRight className="w-4 h-4" />
                            $50
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-slate-800">3 dakika önce</div>
                          <div className="text-xs text-slate-500">21 Ocak 2024</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                          </button>
                        </td>
                      </tr>

                      {/* Example Row 2 */}
                      <tr className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12">
                              <div className="absolute inset-0 bg-slate-100 rounded-xl animate-pulse"></div>
                              <img 
                                src="/product-2.jpg" 
                                alt="AirPods" 
                                className="absolute inset-0 w-full h-full object-cover rounded-xl"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">AirPods Pro</div>
                              <div className="text-sm text-slate-500">Apple</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-slate-800">$249.99</div>
                          <div className="text-sm text-slate-500">Amazon.com</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium bg-rose-500/10 text-rose-500">
                            <ArrowUpRight className="w-4 h-4" />
                            $20
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-slate-800">15 dakika önce</div>
                          <div className="text-xs text-slate-500">21 Ocak 2024</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] opacity-[0.02]"
          style={{
            background: 'radial-gradient(circle, rgba(79,70,229,1) 0%, transparent 70%)'
          }}
        />
      </div>
    </div>
  );
}