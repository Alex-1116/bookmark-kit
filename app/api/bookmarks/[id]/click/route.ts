import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookmarkId = parseInt(id);

  const bookmark = await prisma.bookmark.update({
    where: { id: bookmarkId },
    data: {
      clickCount: { increment: 1 },
      lastClicked: new Date(),
    },
  });

  return NextResponse.json(bookmark);
}
