import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "工作", slug: "work", color: "#3b82f6", icon: "briefcase" },
  { name: "学习", slug: "study", color: "#10b981", icon: "book" },
  { name: "娱乐", slug: "entertainment", color: "#f59e0b", icon: "gamepad" },
  { name: "工具", slug: "tools", color: "#8b5cf6", icon: "wrench" },
  { name: "其他", slug: "other", color: "#6b7280", icon: "folder" },
];

async function main() {
  console.log("开始初始化默认分类...");

  for (const category of defaultCategories) {
    const existing = await prisma.category.findUnique({
      where: { slug: category.slug },
    });

    if (!existing) {
      await prisma.category.create({ data: category });
      console.log(`创建分类: ${category.name}`);
    } else {
      console.log(`分类已存在: ${category.name}`);
    }
  }

  console.log("初始化完成!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
