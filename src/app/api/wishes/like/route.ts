import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { id } = await request.json()
    
    const wish = await prisma.resolution.update({
      where: { id },
      data: {
        likes: {
          increment: 1
        }
      },
      select: {
        id: true,
        likes: true
      }
    })

    return NextResponse.json(wish)
  } catch (error) {
    console.error('Error liking wish:', error)
    return NextResponse.json(
      { error: 'Error liking wish' },
      { status: 500 }
    )
  }
} 