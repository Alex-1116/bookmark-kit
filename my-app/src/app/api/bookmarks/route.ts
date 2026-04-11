import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const categoryId = searchParams.get('categoryId')
    const tagId = searchParams.get('tagId')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const where: any = { isDeleted: false }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (tagId) {
      where.tags = { some: { id: tagId } }
    }

    const orderBy: any = {}
    if (sortBy === 'title') {
      orderBy.title = order
    } else if (sortBy === 'clickCount') {
      orderBy.clickCount = order
    } else {
      orderBy.createdAt = order
    }

    let bookmarks = await prisma.bookmark.findMany({
      where,
      include: {
        category: true,
        tags: true,
      },
      orderBy,
    })

    // 客户端搜索过滤（SQLite 不区分大小写的简单方案）
    if (search) {
      const searchLower = search.toLowerCase()
      bookmarks = bookmarks.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(searchLower) ||
          bookmark.url.toLowerCase().includes(searchLower) ||
          (bookmark.description?.toLowerCase().includes(searchLower) ?? false)
      )
    }

    return NextResponse.json(bookmarks)
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, url, description, categoryId, tagIds } = body

    const bookmark = await prisma.bookmark.create({
      data: {
        title,
        url,
        description,
        categoryId,
        tags: tagIds ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
      },
      include: {
        category: true,
        tags: true,
      },
    })

    return NextResponse.json(bookmark, { status: 201 })
  } catch (error) {
    console.error('Error creating bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    )
  }
}
