import cron from 'node-cron'
import { prisma } from './prisma'

// 每天凌晨2点执行清理任务
const CLEANUP_SCHEDULE = '0 2 * * *'

// 30天的毫秒数
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

export function startCleanupJob() {
  console.log('启动回收站清理定时任务...')

  cron.schedule(CLEANUP_SCHEDULE, async () => {
    try {
      const thirtyDaysAgo = new Date(Date.now() - THIRTY_DAYS_MS)

      const result = await prisma.bookmark.deleteMany({
        where: {
          isDeleted: true,
          deletedAt: {
            lt: thirtyDaysAgo,
          },
        },
      })

      console.log(`清理完成: 删除了 ${result.count} 个超过30天的书签`)
    } catch (error) {
      console.error('清理回收站失败:', error)
    }
  })
}
