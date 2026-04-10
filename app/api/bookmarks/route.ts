import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId");
  const tagId = searchParams.get("tagId");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const where: any = {
    isDeleted: false,
  };

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { url: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (categoryId) {
    where.categoryId = parseInt(categoryId);
  }

  if (tagId) {
    where.tags = {
      some: {
        tagId: parseInt(tagId),
      },
    };
  }

  const orderBy: any = {};
  if (sortBy === "clickCount") {
    orderBy.clickCount = sortOrder;
  } else if (sortBy === "title") {
    orderBy.title = sortOrder;
  } else {
    orderBy.createdAt = sortOrder;
  }

  const bookmarks = await prisma.bookmark.findMany({
    where,
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy,
  });

  return NextResponse.json(bookmarks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, url, description, categoryId, tagIds = [] } = body;

  const bookmark = await prisma.bookmark.create({
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
