import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        isDeleted: true,
        deletedAt: {
          gte: thirtyDaysAgo,
        },
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
