import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      isDeleted: false,
      lastClicked: { not: null },
    },
    include: {
      category: true,
    },
    orderBy: { lastClicked: "desc" },
    take: 5,
  });

  return NextResponse.json(bookmarks);
}
