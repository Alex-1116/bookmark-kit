'use client'

import { Bookmark } from '@/types'
import { recordClick } from '@/lib/api'
import { Clock, ExternalLink } from 'lucide-react'

interface RecentBookmarksProps {
  bookmarks: Bookmark[]
}

export default function RecentBookmarks({ bookmarks }: RecentBookmarksProps) {
  const handleClick = async (bookmark: Bookmark) => {
    await recordClick(bookmark.id)
    window.open(bookmark.url, '_blank')
  }

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    } catch {
      return '/globe.svg'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  if (bookmarks.length === 0) {
    return null
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={18} className="text-blue-500" />
        <h2 className="font-semibold text-gray-900">最近访问</h2>
      </div>
      <div className="space-y-2">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
            onClick={() => handleClick(bookmark)}
          >
            <img
              src={getFaviconUrl(bookmark.url)}
              alt=""
              className="w-5 h-5 rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/globe.svg'
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                {bookmark.title}
              </p>
              <p className="text-xs text-gray-400">
                {bookmark.lastClicked && formatTime(bookmark.lastClicked)}
              </p>
            </div>
            <ExternalLink
              size={14}
              className="text-gray-300 group-hover:text-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
