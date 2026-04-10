import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { name: '工作', icon: 'briefcase', color: '#3B82F6' },
  { name: '学习', icon: 'book', color: '#10B981' },
  { name: '娱乐', icon: 'gamepad', color: '#F59E0B' },
  { name: '工具', icon: 'wrench', color: '#8B5CF6' },
  { name: '其他', icon: 'folder', color: '#6B7280' },
]

async function main() {
  console.log('Seeding database...')

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: category,
      create: category,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
