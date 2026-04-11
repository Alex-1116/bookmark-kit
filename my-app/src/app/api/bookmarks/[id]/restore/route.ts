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
        isDeleted: false,
        deletedAt: null,
      },
      include: {
        category: true,
        tags: true,
      },
    })

    return NextResponse.json(bookmark)
  } catch (error) {
    console.error('Error restoring bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to restore bookmark' },
      { status: 500 }
    )
  }
}
