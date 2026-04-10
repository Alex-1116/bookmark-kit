import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search') || ''

  const where: any = {}

  if (search) {
    where.name = {
      contains: search,
    }
  }

  const tags = await prisma.tag.findMany({
    where,
    include: {
      _count: {
        select: {
          bookmarks: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return NextResponse.json(tags)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name } = body

  const tag = await prisma.tag.create({
    data: {
      name,
    },
  })

  return NextResponse.json(tag)
}
