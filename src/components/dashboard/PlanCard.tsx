// src/components/dashboard/PlanCard.tsx
import { CheckIcon, SparklesIcon } from "lucide-react";

interface PlanCardProps {
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}

export default function PlanCard({ name, price, features, isPopular }: PlanCardProps) {
  return (
    <div className={`
      relative overflow-hidden rounded-2xl bg-white transition-all duration-300
      ${isPopular 
        ? 'shadow-xl shadow-primary/10 ring-2 ring-primary scale-105 lg:scale-110' 
        : 'shadow-lg hover:shadow-xl'}
    `}>
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -right-12 top-8 rotate-45 bg-gradient-to-r from-primary to-violet-500 py-2 px-12 text-sm font-semibold text-white shadow-sm">
          Popular
        </div>
      )}

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${isPopular 
              ? 'bg-gradient-to-br from-primary to-violet-500 text-white' 
              : 'bg-slate-100 text-slate-600'}
          `}>
            <SparklesIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">{name}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                ${price}
              </span>
              <span className="text-slate-500">/ay</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`
                flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5
                ${isPopular ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'}
              `}>
                <CheckIcon className="w-3 h-3" />
              </div>
              <span className="text-slate-600">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <button className={`
          w-full px-6 py-3 rounded-xl font-medium transition-all duration-300
          ${isPopular 
            ? 'bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5' 
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
        `}>
          {isPopular ? 'Hemen Başla' : 'Planı Seç'}
        </button>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 pointer-events-none" />
      {isPopular && (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl" />
        </>
      )}
    </div>
  );
}