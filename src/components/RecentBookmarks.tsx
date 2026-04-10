'use client'

import { Bookmark } from '@/types'

interface RecentBookmarksProps {
  bookmarks: Bookmark[]
}

export default function RecentBookmarks({ bookmarks }: RecentBookmarksProps) {
  if (bookmarks.length === 0) {
    return null
  }

  const handleClick = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">最近访问</h3>
      <div className="flex flex-wrap gap-2">
        {bookmarks.map((bookmark) => {
          const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=32`
          return (
            <button
              key={bookmark.id}
              onClick={() => handleClick(bookmark.url)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <img
                src={faviconUrl}
                alt=""
                className="w-4 h-4 rounded"
                onError={(e) => {
                  e.currentTarget.src = '/file.svg'
                }}
              />
              <span className="text-sm text-gray-700 max-w-[120px] truncate">
                {bookmark.title}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
