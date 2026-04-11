import type { PrismaConfig } from 'prisma'

export default {
  schema: './prisma/schema.prisma',
  datasource: {
    url: 'file:./prisma/dev.db',
  },
} satisfies PrismaConfig
