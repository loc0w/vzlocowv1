// src/components/home/HowItWorks.tsx
'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Scan, LineChart, TrendingUp, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const steps = [
    {
      title: "Scan Products",
      description: "Instantly scan any barcode and get real-time product data",
      icon: Scan,
      color: "from-violet-500 to-purple-500"
    },
    {
      title: "Smart Analysis",
      description: "AI-powered price analysis and market insights",
      icon: LineChart,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Maximize Profits",
      description: "Optimize your pricing strategy with data-driven decisions",
      icon: TrendingUp,
      color: "from-emerald-500 to-green-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative py-32 overflow-hidden bg-slate-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-32 -right-32 rounded-full bg-gradient-to-br from-primary/30 to-violet-500/30 blur-3xl opacity-30" />
        <div className="absolute w-[500px] h-[500px] -bottom-32 -left-32 rounded-full bg-gradient-to-tr from-blue-500/30 to-emerald-500/30 blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div 
            variants={itemVariants}
            className="text-center mb-20 space-y-4"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Three Simple Steps to
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                {" "}Boost Your Sales
              </span>
            </h2>
          </motion.div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Lines */}
            <div className="absolute top-24 left-0 right-0 hidden md:block">
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            </div>

            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center font-bold text-primary">
                  {index + 1}
                </div>

                {/* Card */}
                <div className="group relative pt-8">
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/70 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-xl" />
                  
                  {/* Content */}
                  <div className="relative bg-white/30 backdrop-blur-xl rounded-3xl p-8 transition-all duration-500 group-hover:transform group-hover:-translate-y-2">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} p-4 mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 flex items-center justify-center`}>
                      {<step.icon className="w-8 h-8 text-white" />}
                    </div>

                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-slate-600">{step.description}</p>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-slate-50/50 to-white/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            variants={itemVariants}
            className="mt-20 text-center"
          >
            <button className="relative group inline-flex items-center gap-2">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-violet-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-500" />
              <div className="relative px-8 py-3 bg-white rounded-full leading-none flex items-center gap-2">
                <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent font-medium">
                  Start Optimizing Now
                </span>
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}