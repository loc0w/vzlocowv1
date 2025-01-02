// src/app/api/barcode/route.ts
import { NextResponse } from 'next/server';
import { keepaService } from '@/services/keepaService';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { message: 'Görsel dosyası bulunamadı' },
        { status: 400 }
      );
    }

    // Burada barkod okuma işlemi yapılacak
    // Şimdilik test amaçlı sabit bir ASIN döndürüyoruz
    const testAsin = 'B0CHX3QBCH';

    const product = await keepaService.getProductDetails(testAsin);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Barcode API Error:', error);
    return NextResponse.json(
      { message: 'Barkod işlenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}