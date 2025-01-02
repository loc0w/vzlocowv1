// src/app/terms/page.tsx veya src/app/privacy/page.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, FileText } from 'lucide-react';

// Ortak layout için bir wrapper component
const LegalPageWrapper = ({ 
  children, 
  title, 
  description,
  icon: Icon 
}: { 
  children: React.ReactNode;
  title: string;
  description: string;
  icon: any;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-32 -right-32 rounded-full bg-gradient-to-br from-primary/10 to-violet-500/10 blur-3xl" />
        <div className="absolute w-[500px] h-[500px] -bottom-32 -left-32 rounded-full bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xl" />
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between h-20">
            <Link 
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-primary to-brand-600 bg-clip-text text-transparent"
            >
              PriceScanner
            </Link>
            <Link 
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors px-4 py-2 rounded-full hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative pt-20 pb-12 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{title}</h1>
            <p className="text-lg text-slate-600 mb-6">{description}</p>
            <div className="text-sm text-slate-500">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="prose prose-slate prose-lg max-w-none">
              {children}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative py-12 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-sm text-slate-500">
            <p>
              If you have any questions about these terms, please{' '}
              <Link href="/contact" className="text-primary hover:text-brand-600 font-medium">
                contact us
              </Link>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Terms Page
export default function TermsPage() {
  return (
    <LegalPageWrapper
      title="Terms of Service"
      description="Please read these terms carefully before using our service."
      icon={FileText}
    >
      <div className="space-y-12">
        {/* Section 1 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm"
        >
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-600">
            By accessing and using PriceScanner, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm"
        >
          <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
          <p className="text-slate-600 mb-4">
            PriceScanner provides price analysis and optimization tools for Amazon sellers. Our services include:
          </p>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              Real-time price tracking and analysis
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              Competitive market insights
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              Automated price optimization recommendations
            </li>
          </ul>
        </motion.section>

        {/* Add more sections as needed */}
      </div>
    </LegalPageWrapper>
  );
}