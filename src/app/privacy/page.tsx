// src/app/privacy/page.tsx
'use client';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server, Bell, ArrowLeft } from 'lucide-react';
import Link from 'next/link';


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



export default function PrivacyPage() {
  return (
    <LegalPageWrapper
      title="Privacy Policy"
      description="We care about your privacy and data protection."
      icon={Shield}
    >
      <div className="space-y-12">
        {/* Data Collection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm"
        >
          <h2 className="flex items-center gap-3 text-2xl font-semibold mb-6">
            <span className="p-2 rounded-lg bg-primary/10 text-primary">
              <Eye className="w-6 h-6" />
            </span>
            Data Collection
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-white/80 border border-slate-200">
              <h3 className="font-medium mb-3">Information You Provide</h3>
              <ul className="space-y-3">
                {[
                  "Account credentials",
                  "Business information",
                  "Payment details",
                  "User preferences"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <Lock className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-white/80 border border-slate-200">
              <h3 className="font-medium mb-3">Automatically Collected</h3>
              <ul className="space-y-3">
                {[
                  "Usage statistics",
                  "Device information",
                  "IP address",
                  "Browser data"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <Server className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Data Usage */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm"
        >
          <h2 className="flex items-center gap-3 text-2xl font-semibold mb-6">
            <span className="p-2 rounded-lg bg-primary/10 text-primary">
              <Server className="w-6 h-6" />
            </span>
            How We Use Your Data
          </h2>
          <div className="grid gap-4">
            {[
              {
                title: "Service Improvement",
                description: "We analyze usage patterns to enhance our platform's functionality and user experience."
              },
              {
                title: "Communication",
                description: "We send important updates, security alerts, and promotional materials (with your consent)."
              },
              {
                title: "Support",
                description: "We use your information to provide customer support and resolve technical issues."
              },
              {
                title: "Analytics",
                description: "We perform statistical analysis to improve our services and develop new features."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/80 border border-slate-200">
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Data Protection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm"
        >
          <h2 className="flex items-center gap-3 text-2xl font-semibold mb-6">
            <span className="p-2 rounded-lg bg-primary/10 text-primary">
              <Shield className="w-6 h-6" />
            </span>
            Data Protection
          </h2>
          <div className="space-y-6">
            <p className="text-slate-600">
              We implement robust security measures to protect your personal information:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Encryption",
                  items: [
                    "SSL/TLS encryption",
                    "End-to-end data protection",
                    "Secure data storage",
                    "Encrypted backups"
                  ]
                },
                {
                  title: "Security Measures",
                  items: [
                    "Regular security audits",
                    "Access control",
                    "24/7 monitoring",
                    "Incident response plan"
                  ]
                }
              ].map((group, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/80 border border-slate-200">
                  <h3 className="font-medium mb-3">{group.title}</h3>
                  <ul className="space-y-2">
                    {group.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <Lock className="w-4 h-4 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Your Rights */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm"
        >
          <h2 className="flex items-center gap-3 text-2xl font-semibold mb-6">
            <span className="p-2 rounded-lg bg-primary/10 text-primary">
              <Bell className="w-6 h-6" />
            </span>
            Your Rights
          </h2>
          <div className="space-y-6">
            <p className="text-slate-600">
              You have several rights regarding your personal data:
            </p>
            <div className="grid gap-4">
              {[
                {
                  title: "Access Your Data",
                  description: "You can request a copy of your personal data at any time."
                },
                {
                  title: "Data Correction",
                  description: "You can request corrections to your personal information if it's inaccurate."
                },
                {
                  title: "Data Deletion",
                  description: "You can request deletion of your personal data (right to be forgotten)."
                },
                {
                  title: "Data Portability",
                  description: "You can request to transfer your data to another service provider."
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/80 border border-slate-200">
                  <h3 className="font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-brand-600/10 border border-primary/20"
        >
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Privacy Concerns?</h2>
            <p className="text-slate-600">
              If you have any questions about our Privacy Policy, please don't hesitate to contact us.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full text-primary hover:text-brand-600 transition-colors shadow-sm hover:shadow">
              Contact Our Privacy Team
            </button>
          </div>
        </motion.section>
      </div>
    </LegalPageWrapper>
  );
}