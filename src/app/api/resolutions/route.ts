import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const resolutions = await prisma.resolution.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        character: true,
        createdAt: true
      }
    });

    return NextResponse.json(resolutions)
  } catch (error) {
    console.error('Error fetching resolutions:', error)
    return NextResponse.json(
      { error: 'Error fetching resolutions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const resolution = await prisma.resolution.create({
      data: {
        name: body.name,
        character: body.character,
        objectives: [
          body.resolutions.first,
          body.resolutions.second,
          body.resolutions.third,
        ],
        atlasWish: body.requirements,
      },
    })

    return NextResponse.json(resolution)
  } catch (error) {
    console.error('Error saving resolution:', error)
    return NextResponse.json(
      { error: 'Error saving resolution' },
      { status: 500 }
    )
  }
} 