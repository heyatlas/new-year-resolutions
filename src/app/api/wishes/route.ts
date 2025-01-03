import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const wishes = await prisma.resolution.findMany({
      select: {
        id: true,
        atlasWish: true,
        name: true,
        likes: true,
      },
      where: {
        atlasWish: {
          not: '',
        },
      },
    });

    // Shuffle the wishes array
    const shuffledWishes = wishes.sort(() => Math.random() - 0.5);
    
    // Return only the first 5 wishes
    return NextResponse.json(shuffledWishes.slice(0, 5))
  } catch (error) {
    console.error('Error fetching wishes:', error)
    return NextResponse.json(
      { error: 'Error fetching wishes' },
      { status: 500 }
    )
  }
} 