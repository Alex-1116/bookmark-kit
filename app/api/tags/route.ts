import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(tags);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name } = body;
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const tag = await prisma.tag.upsert({
    where: { slug },
    update: {},
    create: { name, slug },
  });

  return NextResponse.json(tag);
}
