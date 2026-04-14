import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        isDeleted: false,
        lastClicked: { not: null },
      },
      include: {
        category: true,
        tags: true,
      },
      orderBy: { lastClicked: 'desc' },
      take: 5,
    })

    return NextResponse.json(bookmarks)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recent bookmarks' },
      { status: 500 }
    )
  }
}
