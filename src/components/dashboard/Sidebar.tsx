// src/components/dashboard/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scan, Heart, Crown, ChevronRight } from 'lucide-react';

const menuItems = [
  {
    href: '/dashboard',
    label: 'Ana Sayfa',
    icon: Home,
    description: 'Genel bakış ve istatistikler'
  },
  {
    href: '/dashboard/scan',
    label: 'Ürün Tara',
    icon: Scan,
    description: 'Amazon ürünlerini analiz et'
  },
  {
    href: '/dashboard/favorites',
    label: 'Favorilerim',
    icon: Heart,
    description: 'Takip ettiğin ürünler'
  },
  {
    href: '/dashboard/subscription',
    label: 'Premium',
    icon: Crown,
    description: 'Premium özellikleri keşfet',
    badge: 'Yeni'
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-80 bg-white border-r border-slate-100 h-full flex flex-col">
      {/* Logo Section */}
      <div className="p-6">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 group transition-transform duration-200 hover:-translate-y-0.5"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-shadow">
            <span className="text-white font-bold text-xl">SP</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              SellerPartner
            </h1>
            <p className="text-xs text-slate-500"></p>
          </div>
        </Link>
      </div>


      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                  }
                `}
              >
                {/* Icon */}
                <div className={`
                  flex-shrink-0 w-5 h-5 transition-transform duration-300
                  ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}
                `}>
                  <item.icon className="w-full h-full" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${isActive ? 'text-white' : 'text-slate-700'}`}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-medium
                        ${isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-primary/10 text-primary'}
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className={`
                    text-xs mt-0.5 transition-all duration-300
                    ${isActive 
                      ? 'text-white/70' 
                      : 'text-slate-500 group-hover:text-slate-600'}
                  `}>
                    {item.description}
                  </p>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-white" />
                )}

                {/* Hover Effect */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Plan Usage */}
      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-violet-500 p-5 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white" />
            <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-white" />
          </div>

          {/* Content */}
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white/90">Günlük Tarama</span>
              <span className="px-2 py-1 rounded-full bg-white/20 text-xs font-medium">
                Pro Plan
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="text-2xl font-bold">5/10</div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: '50%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}