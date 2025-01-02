// src/app/dashboard/favorites/page.tsx
import { Star, ExternalLink, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="flex-shrink-0 border-b border-slate-100 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent">
                Favorilerim
              </h1>
              <p className="text-slate-600 mt-1">
                Takip ettiğin ürünleri buradan yönetebilirsin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg ring-1 ring-slate-100/80">
          <div className="p-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <select className="select select-bordered bg-white text-sm">
                  <option>Tüm Ürünler</option>
                  <option>Fiyatı Düşenler</option>
                  <option>Fiyatı Artanlar</option>
                </select>
                <select className="select select-bordered bg-white text-sm">
                  <option>Son Eklenen</option>
                  <option>En Yüksek Fiyat</option>
                  <option>En Düşük Fiyat</option>
                </select>
              </div>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Ürün ara..."
                  className="input input-bordered bg-white pl-10 pr-4 w-full sm:w-64"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Product Card */}
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100/80 hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src="/product-1.jpg"
                      alt="Product"
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-slate-800">iPhone 13 Pro</h3>
                        <p className="text-sm text-slate-500">Apple</p>
                      </div>
                      <Link 
                        href="#" 
                        className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                      </Link>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-500">Mevcut Fiyat</div>
                        <div className="text-lg font-semibold text-slate-800">$999.99</div>
                      </div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-500">
                        <ArrowDownRight className="w-4 h-4" />
                        $50
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-slate-500">Son güncelleme</div>
                        <div className="text-slate-800">3 dakika önce</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="join">
                <button className="join-item btn btn-sm">«</button>
                <button className="join-item btn btn-sm">1</button>
                <button className="join-item btn btn-sm btn-active">2</button>
                <button className="join-item btn btn-sm">3</button>
                <button className="join-item btn btn-sm">»</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}