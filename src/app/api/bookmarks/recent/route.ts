import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const recentBookmarks = await prisma.bookmark.findMany({
    where: {
      isDeleted: false,
      clickCount: {
        gt: 0,
      },
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 5,
  })

  return NextResponse.json(recentBookmarks)
}
