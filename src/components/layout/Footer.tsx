// src/components/layout/Footer.tsx
'use client';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-32 -right-32 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 blur-3xl opacity-20" />
        <div className="absolute w-[500px] h-[500px] -bottom-32 -left-32 rounded-full bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 blur-3xl opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Logo & Description */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2"
              >
                {/* Logo */}
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                SellerPartner
                </span>
              </motion.div>
              <p className="text-sm text-slate-400 max-w-md">
                Empowering Amazon sellers with AI-driven pricing intelligence.
              </p>
            </div>

            {/* Right Side - Social Links & Credits */}
            <div className="flex flex-col items-end gap-4">
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/datz-software" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com/datz-software" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com/company/datz-software" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-slate-800/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <span>© {currentYear}</span>
                <a 
                  href="https://datz.software" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors font-medium"
                >
                  Datz Software
                </a>
                <span>• All rights reserved.</span>
              </div>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}