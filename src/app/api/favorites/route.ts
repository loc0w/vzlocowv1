import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db(); // .env içinde DB adı belirtmediyseniz varsayılan DB gelir
    const favoritesCollection = db.collection('favorites');

    // Kullanıcının favorilerini çek
    const favorites = await favoritesCollection
      .find({ userEmail: session.user.email })
      .toArray();

    return NextResponse.json(favorites, { status: 200 });
  } catch (error) {
    console.error('Favorites GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      asin,
      title,
      imageUrl,
      currentPrice,
      lastUpdate,
      priceHistory,
      stats,
    } = body;

    if (!asin) {
      return NextResponse.json(
        { error: 'ASIN is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const favoritesCollection = db.collection('favorites');

    // Yeni favori kaydı ekle
    const newFavorite = {
      userEmail: session.user.email,
      asin,
      title,
      imageUrl,
      currentPrice,
      lastUpdate,
      priceHistory: priceHistory || [],
      stats: stats || {},
      createdAt: new Date(),
    };

    const result = await favoritesCollection.insertOne(newFavorite);


    return NextResponse.json(newFavorite, { status: 201 });
  } catch (error) {
    console.error('Favorites POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create favorite' },
      { status: 500 }
    );
  }
}
