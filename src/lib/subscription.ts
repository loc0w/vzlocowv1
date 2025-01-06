// lib/subscription.ts
import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export async function getUserSubscription(userId: string) {
  const client = await clientPromise;
  const db = client.db();

  const subscription = await db.collection('subscriptions').findOne({ userId });
  return subscription;
}

export async function createOrUpdateSubscription(userId: string, planId: string) {
  const client = await clientPromise;
  const db = client.db();

  const currentDate = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const subscription = {
    userId,
    planId,
    status: 'active',
    currentPeriodStart: currentDate,
    currentPeriodEnd: nextMonth,
    cancelAtPeriodEnd: false,
    dailyScansUsed: 0,
    lastScanReset: currentDate,
    updatedAt: currentDate
  };

  const result = await db.collection('subscriptions').updateOne(
    { userId },
    { $set: subscription },
    { upsert: true }
  );

  return subscription;
}

export async function resetDailyScans() {
  const client = await clientPromise;
  const db = client.db();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await db.collection('subscriptions').updateMany(
    { lastScanReset: { $lt: yesterday } },
    { 
      $set: { 
        dailyScansUsed: 0,
        lastScanReset: new Date()
      }
    }
  );
}

export async function incrementDailyScans(userId: string) {
  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection('subscriptions').updateOne(
    { userId },
    { 
      $inc: { dailyScansUsed: 1 },
      $set: { updatedAt: new Date() }
    }
  );

  return result;
}

export async function checkUserCanScan(userId: string) {
  const subscription = await getUserSubscription(userId);
  if (!subscription) {
    return false;
  }

  const plan = SUBSCRIPTION_PLANS[subscription.planId.toUpperCase()];
  if (!plan) {
    return false;
  }

  // Günlük scan limitini kontrol et
  return subscription.dailyScansUsed < plan.scanLimit;
}