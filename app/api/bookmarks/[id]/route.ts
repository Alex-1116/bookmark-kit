import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await request.json();
  const { title, url, description, categoryId, tagIds = [] } = body;
  const { id } = await params;
  const bookmarkId = parseInt(id);

  await prisma.bookmarkToTag.deleteMany({
    where: { bookmarkId },
  });

  const bookmark = await prisma.bookmark.update({
    where: { id: bookmarkId },
    data: {
      title,
      url,
      description,
      categoryId: categoryId || null,
      tags: {
        create: tagIds.map((tagId: number) => ({
          tagId,
        })),
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
  });

  return NextResponse.json(bookmark);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookmarkId = parseInt(id);

  const bookmark = await prisma.bookmark.update({
    where: { id: bookmarkId },
    data: { isDeleted: true },
  });

  return NextResponse.json(bookmark);
}
