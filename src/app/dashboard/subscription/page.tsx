// app/dashboard/subscription/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  AlertCircle,
  X,
  Check,
  Zap,
  Clock,
  Heart,
  Bell,
  BarChart3,
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, formatPrice } from '@/utils/subscription';

interface SubscriptionState {
  planId: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

const PlanFeatureIcon = ({ feature }: { feature: string }) => {
  // Feature'a göre ikon seç
  if (feature.toLowerCase().includes('scan')) return <Zap className="w-5 h-5 text-primary" />;
  if (feature.toLowerCase().includes('interval')) return <Clock className="w-5 h-5 text-primary" />;
  if (feature.toLowerCase().includes('favorite')) return <Heart className="w-5 h-5 text-primary" />;
  if (feature.toLowerCase().includes('notification')) return <Bell className="w-5 h-5 text-primary" />;
  if (feature.toLowerCase().includes('analytics')) return <BarChart3 className="w-5 h-5 text-primary" />;
  return <Check className="w-5 h-5 text-primary" />;
};

const PlanCard = ({ 
  plan, 
  currentPlan, 
  onSelect, 
  isLoading 
}: { 
  plan: typeof SUBSCRIPTION_PLANS.BASIC,
  currentPlan: SubscriptionState | null,
  onSelect: (plan: typeof SUBSCRIPTION_PLANS.BASIC) => void,
  isLoading: boolean
}) => {
  const isSelected = currentPlan?.planId === plan.id;

  return (
    <div className={`
      bg-white rounded-3xl shadow-xl overflow-hidden
      ${isSelected ? 'ring-2 ring-primary' : ''}
      transition-all duration-200 hover:shadow-2xl hover:-translate-y-1
    `}>
      <div className="p-6">
        {plan.isPopular && (
          <div className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-4">
            Most Popular
          </div>
        )}
        
        <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
        <p className="text-slate-600 mt-2">{plan.description}</p>
        
        <div className="mt-4 flex items-baseline">
          <span className="text-3xl font-bold text-primary">
            {formatPrice(plan.price)}
          </span>
          <span className="text-slate-500 ml-2">/ month</span>
        </div>

        <div className="mt-6 space-y-4">
          <div className="text-sm font-medium text-slate-600">
            {plan.scanLimit} scans per day
          </div>
          
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-slate-600">
                <PlanFeatureIcon feature={feature} />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => onSelect(plan)}
          disabled={isLoading}
          className={`
            mt-8 w-full py-3 px-6 rounded-xl font-medium transition-all
            ${isSelected 
              ? 'bg-slate-100 text-slate-600' 
              : 'bg-primary text-white hover:shadow-lg hover:shadow-primary/25'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isSelected ? 'Current Plan' : 'Select Plan'}
        </button>
      </div>
    </div>
  );
};

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simüle edilmiş subscription yükleme
  useEffect(() => {
    // Gerçek uygulamada bu API'den gelecek
    setSubscription({
      planId: 'basic',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false
    });
  }, []);

  const handlePlanSelect = async (plan: typeof SUBSCRIPTION_PLANS.BASIC) => {
    setIsLoading(true);
    try {
      // Simüle edilmiş plan değişikliği
      // Gerçek uygulamada burada API çağrısı yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscription({
        planId: plan.id,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false
      });
      // Başarı mesajı göster
      alert(`Successfully switched to ${plan.name} plan!`);
    } catch (err) {
      setError('Failed to change subscription plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-slate-600">
            Select the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Current Subscription Info */}
        {subscription && (
          <div className="bg-white rounded-3xl shadow-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Current Plan: {SUBSCRIPTION_PLANS[subscription.planId.toUpperCase()]?.name}
                  </h3>
                  {subscription.currentPeriodEnd && (
                    <p className="text-sm text-slate-500">
                      Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              {subscription.cancelAtPeriodEnd && (
                <span className="text-sm text-red-600 font-medium">
                  Cancels at period end
                </span>
              )}
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              currentPlan={subscription}
              onSelect={handlePlanSelect}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50">
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl shadow-lg border border-red-100 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto p-1 hover:bg-red-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}