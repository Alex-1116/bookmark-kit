import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const bookmark = await prisma.bookmark.findUnique({
    where: { id },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  if (!bookmark) {
    return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 })
  }

  return NextResponse.json(bookmark)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { title, url, description, categoryId, tags } = body

  await prisma.bookmarkTag.deleteMany({
    where: { bookmarkId: id },
  })

  const bookmark = await prisma.bookmark.update({
    where: { id },
    data: {
      title,
      url,
      description,
      categoryId: categoryId || null,
      tags: tags
        ? {
            create: tags.map((tagId: string) => ({
              tag: { connect: { id: tagId } },
            })),
          }
        : undefined,
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  return NextResponse.json(bookmark)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const bookmark = await prisma.bookmark.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  })

  return NextResponse.json(bookmark)
}
