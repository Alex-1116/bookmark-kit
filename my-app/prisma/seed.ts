import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建预设分类
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: '工作' },
      update: {},
      create: { name: '工作', color: '#3b82f6', icon: 'briefcase' },
    }),
    prisma.category.upsert({
      where: { name: '学习' },
      update: {},
      create: { name: '学习', color: '#10b981', icon: 'book' },
    }),
    prisma.category.upsert({
      where: { name: '娱乐' },
      update: {},
      create: { name: '娱乐', color: '#f59e0b', icon: 'gamepad' },
    }),
    prisma.category.upsert({
      where: { name: '工具' },
      update: {},
      create: { name: '工具', color: '#8b5cf6', icon: 'wrench' },
    }),
    prisma.category.upsert({
      where: { name: '其他' },
      update: {},
      create: { name: '其他', color: '#6b7280', icon: 'folder' },
    }),
  ])

  console.log('Created categories:', categories.map(c => c.name))

  // 创建预设标签
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: '重要' },
      update: {},
      create: { name: '重要', color: '#ef4444' },
    }),
    prisma.tag.upsert({
      where: { name: '常用' },
      update: {},
      create: { name: '常用', color: '#3b82f6' },
    }),
    prisma.tag.upsert({
      where: { name: '待阅读' },
      update: {},
      create: { name: '待阅读', color: '#f59e0b' },
    }),
    prisma.tag.upsert({
      where: { name: '收藏' },
      update: {},
      create: { name: '收藏', color: '#ec4899' },
    }),
    prisma.tag.upsert({
      where: { name: '教程' },
      update: {},
      create: { name: '教程', color: '#10b981' },
    }),
  ])

  console.log('Created tags:', tags.map(t => t.name))

  // 创建示例书签
  const workCategory = categories.find(c => c.name === '工作')
  const studyCategory = categories.find(c => c.name === '学习')
  const toolCategory = categories.find(c => c.name === '工具')
  const entertainmentCategory = categories.find(c => c.name === '娱乐')

  const importantTag = tags.find(t => t.name === '重要')
  const frequentlyUsedTag = tags.find(t => t.name === '常用')
  const tutorialTag = tags.find(t => t.name === '教程')
  const favoriteTag = tags.find(t => t.name === '收藏')

  const bookmarks = await Promise.all([
    prisma.bookmark.upsert({
      where: { id: 'bookmark-1' },
      update: {},
      create: {
        id: 'bookmark-1',
        title: 'GitHub',
        url: 'https://github.com',
        description: '全球最大的代码托管平台',
        categoryId: workCategory?.id,
        clickCount: 42,
        lastClicked: new Date(Date.now() - 86400000),
        tags: {
          connect: [
            ...(frequentlyUsedTag ? [{ id: frequentlyUsedTag.id }] : []),
            ...(importantTag ? [{ id: importantTag.id }] : []),
          ],
        },
      },
    }),
    prisma.bookmark.upsert({
      where: { id: 'bookmark-2' },
      update: {},
      create: {
        id: 'bookmark-2',
        title: 'Next.js 文档',
        url: 'https://nextjs.org/docs',
        description: 'Next.js 官方文档，React 框架',
        categoryId: studyCategory?.id,
        clickCount: 28,
        lastClicked: new Date(Date.now() - 172800000),
        tags: {
          connect: [
            ...(tutorialTag ? [{ id: tutorialTag.id }] : []),
            ...(frequentlyUsedTag ? [{ id: frequentlyUsedTag.id }] : []),
          ],
        },
      },
    }),
    prisma.bookmark.upsert({
      where: { id: 'bookmark-3' },
      update: {},
      create: {
        id: 'bookmark-3',
        title: 'Tailwind CSS',
        url: 'https://tailwindcss.com',
        description: '实用优先的 CSS 框架',
        categoryId: toolCategory?.id,
        clickCount: 35,
        lastClicked: new Date(Date.now() - 43200000),
        tags: {
          connect: [
            ...(frequentlyUsedTag ? [{ id: frequentlyUsedTag.id }] : []),
          ],
        },
      },
    }),
    prisma.bookmark.upsert({
      where: { id: 'bookmark-4' },
      update: {},
      create: {
        id: 'bookmark-4',
        title: 'YouTube',
        url: 'https://youtube.com',
        description: '视频分享平台',
        categoryId: entertainmentCategory?.id,
        clickCount: 15,
        lastClicked: new Date(Date.now() - 259200000),
        tags: {
          connect: [
            ...(favoriteTag ? [{ id: favoriteTag.id }] : []),
          ],
        },
      },
    }),
    prisma.bookmark.upsert({
      where: { id: 'bookmark-5' },
      update: {},
      create: {
        id: 'bookmark-5',
        title: 'Prisma 文档',
        url: 'https://prisma.io/docs',
        description: '现代数据库工具包',
        categoryId: studyCategory?.id,
        clickCount: 12,
        lastClicked: new Date(Date.now() - 345600000),
        tags: {
          connect: [
            ...(tutorialTag ? [{ id: tutorialTag.id }] : []),
          ],
        },
      },
    }),
    prisma.bookmark.upsert({
      where: { id: 'bookmark-6' },
      update: {},
      create: {
        id: 'bookmark-6',
        title: 'Vercel',
        url: 'https://vercel.com',
        description: '前端部署平台',
        categoryId: toolCategory?.id,
        clickCount: 8,
        tags: {
          connect: [
            ...(importantTag ? [{ id: importantTag.id }] : []),
          ],
        },
      },
    }),
  ])

  console.log('Created bookmarks:', bookmarks.map(b => b.title))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
