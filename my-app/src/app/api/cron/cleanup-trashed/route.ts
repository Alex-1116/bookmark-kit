import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const result = await prisma.bookmark.deleteMany({
      where: {
        isDeleted: true,
        deletedAt: {
          lt: thirtyDaysAgo,
        },
      },
    })

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    })
  } catch (error) {
    console.error('Error cleaning up trashed bookmarks:', error)
    return NextResponse.json(
      { error: 'Failed to clean up trashed bookmarks' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return POST()
}
