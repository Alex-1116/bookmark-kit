import { PrismaClient } from '.prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 创建 PrismaLibSql 适配器
const adapter = new PrismaLibSql({
  url: 'file:./prisma/dev.db',
})

// 使用适配器创建 PrismaClient
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
