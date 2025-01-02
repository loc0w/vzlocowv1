// src/app/api/scan/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { checkScanLimit } from '@/utils/planLimits';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    const session = await getServerSession();

    // Auth kontrolü
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Limit kontrolü
    const canScan = await checkScanLimit(session.user.id);
    if (!canScan) {
      return NextResponse.json(
        { error: 'Günlük tarama limitinize ulaştınız' },
        { status: 403 }
      );
    }

    // TODO: Keepa API entegrasyonu
    const productData = {
      title: 'Test Ürün',
      price: 99.99,
      // ... diğer veriler
    };

    return NextResponse.json(productData);
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}