import cron from 'node-cron'
import { prisma } from '../src/lib/prisma'

async function cleanupExpiredBookmarks() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  try {
    const result = await prisma.bookmark.deleteMany({
      where: {
        isDeleted: true,
        deletedAt: {
          lt: thirtyDaysAgo,
        },
      },
    })
    console.log(`[${new Date().toISOString()}] Cleaned up ${result.count} expired bookmarks`)
  } catch (error) {
    console.error('Failed to cleanup expired bookmarks:', error)
  }
}

async function main() {
  console.log('Starting cleanup scheduler...')
  console.log('Schedule: Every day at 00:00')

  cron.schedule('0 0 * * *', cleanupExpiredBookmarks)

  console.log('Cleanup scheduler is running. Press Ctrl+C to stop.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
