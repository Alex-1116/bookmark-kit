import cron from 'node-cron'
import { prisma } from './prisma'

let isInitialized = false

export function initCronJobs() {
  if (isInitialized || process.env.NODE_ENV === 'development') {
    return
  }

  isInitialized = true

  cron.schedule('0 0 * * *', async () => {
    console.log('Running cleanup of trashed bookmarks...')

    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const result = await prisma.bookmark.deleteMany({
        where: {
          isDeleted: true,
          deletedAt: {
            lt: thirtyDaysAgo,
          },
        },
      })

      console.log(`Cleaned up ${result.count} trashed bookmarks`)
    } catch (error) {
      console.error('Error during cron cleanup:', error)
    }
  })

  console.log('Cron jobs initialized')
}
