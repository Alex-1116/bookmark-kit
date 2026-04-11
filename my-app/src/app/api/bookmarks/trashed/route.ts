import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        isDeleted: true,
      },
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        deletedAt: 'desc',
      },
    })

    return NextResponse.json(bookmarks)
  } catch (error) {
    console.error('Error fetching trashed bookmarks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trashed bookmarks' },
      { status: 500 }
    )
  }
}
