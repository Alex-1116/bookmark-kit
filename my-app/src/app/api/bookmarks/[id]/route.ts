import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const bookmark = await prisma.bookmark.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true,
      },
    })

    if (!bookmark) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(bookmark)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bookmark' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, url, description, categoryId, tagIds } = body

    const bookmark = await prisma.bookmark.update({
      where: { id },
      data: {
        title,
        url,
        description,
        categoryId,
        tags: { set: tagIds ? tagIds.map((id: string) => ({ id })) : [] },
      },
      include: {
        category: true,
        tags: true,
      },
    })

    return NextResponse.json(bookmark)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update bookmark' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const bookmark = await prisma.bookmark.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return NextResponse.json(bookmark)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete bookmark' },
      { status: 500 }
    )
  }
}
