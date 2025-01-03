// src/app/api/products/[asin]/route.ts

import { NextResponse } from 'next/server';
import { keepaService } from '@/services/keepaService';

export async function GET(
  request: Request,
  { params }: { params: { asin: string } }
) {
  try {
    const asin = params?.asin;

    if (!asin || typeof asin !== 'string') {
      return NextResponse.json(
        { error: { message: 'ASIN parametresi eksik' } },
        { status: 400 }
      );
    }

    // ASIN formatını kontrol et
    if (!/^[A-Z0-9]{10}$/.test(asin)) {
      return NextResponse.json(
        { error: { message: 'Geçersiz ASIN formatı' } },
        { status: 400 }
      );
    }

    const product = await keepaService.getProductDetails(asin);
    return NextResponse.json(product);

  } catch (error) {
    console.error('API Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Bir hata oluştu';
    
    return NextResponse.json(
      { error: { message: errorMessage } },
      { status: 500 }
    );
  }
}