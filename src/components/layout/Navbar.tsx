// src/components/layout/Navbar.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
              SellerPartner
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Navigation Links */}
            <div className="flex items-center gap-8">
              {[
                { label: 'Home', id: 'home' },
                { label: 'How It Works', id: 'how-it-works' },
                { label: 'Reviews', id: 'testimonials' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-slate-600 hover:text-primary transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <button className="text-slate-600 hover:text-primary transition-colors">
                Login
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-brand-600 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300" />
                <div className="relative px-6 py-2 bg-white rounded-full">
                  <span className="bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent">
                    Try Free
                  </span>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden relative z-10 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-600" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden absolute top-20 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-lg overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6 space-y-4">
                {[
                  { label: 'How It Works', id: 'how-it-works' },
                  { label: 'Reviews', id: 'testimonials' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left text-slate-600 hover:text-primary transition-colors py-2"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <button className="block w-full text-left text-slate-600 hover:text-primary transition-colors py-2">
                    Login
                  </button>
                  <button className="block w-full px-6 py-2 bg-gradient-to-r from-primary to-brand-600 text-white rounded-full">
                    Try Free
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}