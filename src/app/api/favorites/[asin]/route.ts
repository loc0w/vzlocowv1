// src/app/api/favorites/[asin]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { asin: string } }
) {
  try {
    // Auth kontrolü
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { asin } = params;
    if (!asin) {
      return NextResponse.json({ error: 'ASIN is required' }, { status: 400 });
    }

    // MongoDB bağlantısı
    const client = await clientPromise;
    const db = client.db();

    // Favoriyi sil
    const result = await db.collection('favorites').deleteOne({
      userEmail: session.user.email,
      asin: asin
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('DELETE /api/favorites/[asin] error:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}

// GET metodu - Tek bir favoriyi getirmek için (isteğe bağlı)
export async function GET(
  request: NextRequest,
  { params }: { params: { asin: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { asin } = params;
    if (!asin) {
      return NextResponse.json({ error: 'ASIN is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const favorite = await db.collection('favorites').findOne({
      userEmail: session.user.email,
      asin: asin
    });

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(favorite);
  } catch (error) {
    console.error('GET /api/favorites/[asin] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorite' },
      { status: 500 }
    );
  }
}