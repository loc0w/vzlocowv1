import { User } from "../models/schema";

// src/utils/planLimits.ts
export const PLAN_FEATURES = {
    FREE: {
      scanLimit: 5,
      features: ['Temel Arama', 'Fiyat Geçmişi']
    },
    PRO: {
      scanLimit: 50,
      features: ['Barkod Tarama', 'Email Bildirim', 'Detaylı Grafikler']
    },
    PRO_PLUS: {
      scanLimit: 1000,
      features: ['Sınırsız Tarama', 'API Erişimi', 'Öncelikli Destek']
    }
  };
  
  // Limit Kontrolü
  export async function checkScanLimit(userId: string) {
    const user = await User.findById(userId);
    
    // Günlük limit sıfırlama kontrolü
    const today = new Date();
    if (isNewDay(user.dailyScans.lastReset)) {
      user.dailyScans.count = 0;
      user.dailyScans.lastReset = today;
      await user.save();
    }
    
    const limit = PLAN_FEATURES[user.plan].scanLimit;
    return user.dailyScans.count < limit;
  }

function isNewDay(lastReset: Date): boolean {
  const today = new Date();
  return lastReset.getDate() !== today.getDate() ||
         lastReset.getMonth() !== today.getMonth() ||
         lastReset.getFullYear() !== today.getFullYear();
}
