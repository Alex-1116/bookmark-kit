import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const bookmark = await prisma.bookmark.update({
      where: { id },
      data: {
        clickCount: { increment: 1 },
        lastClicked: new Date(),
      },
    })

    return NextResponse.json(bookmark)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to record click' },
      { status: 500 }
    )
  }
}
