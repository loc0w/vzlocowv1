// src/app/api/products/[asin]/route.ts
import { NextResponse } from 'next/server';
import { keepaService } from '@/services/keepaService';

export async function GET(
  request: Request,
  { params }: { params: { asin: string } }
) {
  try {
    // ASIN formatını kontrol et
    if (!params.asin || !params.asin.match(/^[A-Z0-9]{10}$/)) {
      return NextResponse.json(
        { message: 'Geçersiz ASIN formatı' },
        { status: 400 }
      );
    }

    const product = await keepaService.getProductDetails(params.asin);
    return NextResponse.json(product);
  } catch (error) {
    console.error('API Error:', error);

    if (error instanceof Error) {
      if (error.message.includes('API anahtarı')) {
        return NextResponse.json(
          { message: 'API yapılandırması eksik' },
          { status: 500 }
        );
      }
      if (error.message.includes('limit aşımı')) {
        return NextResponse.json(
          { message: error.message },
          { status: 429 }
        );
      }
      if (error.message.includes('bulunamadı')) {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}