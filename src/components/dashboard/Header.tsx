// src/components/dashboard/Header.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Menu, 
  Settings, 
  LogOut, 
  User,
  Crown,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

// Kullanıcı adından baş harfleri alma fonksiyonu
const getInitials = (name: string = 'User Name') => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function Header() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userInitials = getInitials(session?.user?.name);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`
      fixed top-0 right-0 left-0 lg:left-80 z-30
      transition-all duration-300
      ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-white'}
    `}>
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle">
            <Menu className="h-5 w-5" />
          </label>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Scan Counter */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full">
            <div className="text-sm font-medium text-slate-600">Günlük Tarama</div>
            <div className="px-2 py-1 bg-primary/10 rounded-full">
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                5/10
              </span>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button 
              className="group flex items-center gap-3 px-2 py-1 rounded-full hover:bg-slate-50 transition-all duration-300"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white font-semibold text-sm">
                  {userInitials}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-sm font-medium text-slate-700">{session?.user?.name || 'Kullanıcı'}</div>
                <div className="text-xs bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent font-medium">
                  Pro Üye
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors duration-300" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 animate-slideIn">
                <div className="p-3 border-b border-slate-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white font-semibold">
                      {userInitials}
                    </div>
                    <div>
                      <div className="font-medium text-slate-700">{session?.user?.name}</div>
                      <div className="text-sm text-slate-500">{session?.user?.email}</div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link 
                    href="/dashboard/profile"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors duration-300 text-slate-600 hover:text-slate-900"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profilim</span>
                  </Link>
                  <Link 
                    href="/dashboard/subscription"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors duration-300 text-slate-600 hover:text-slate-900"
                  >
                    <Crown className="w-4 h-4" />
                    <span className="text-sm">Pro Üyelik</span>
                  </Link>
                  <Link 
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors duration-300 text-slate-600 hover:text-slate-900"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Ayarlar</span>
                  </Link>
                </div>
                <div className="p-2 border-t border-slate-200/50">
                  <button 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors duration-300 text-red-600 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Çıkış Yap</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}