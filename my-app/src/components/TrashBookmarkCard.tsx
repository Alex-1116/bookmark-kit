'use client'

import { Bookmark } from '@/types'
import { RotateCcw, Trash2, ExternalLink, Clock } from 'lucide-react'

interface TrashBookmarkCardProps {
  bookmark: Bookmark
  onRestore: (id: string) => void
  onPermanentDelete: (id: string) => void
}

export function TrashBookmarkCard({
  bookmark,
  onRestore,
  onPermanentDelete,
}: TrashBookmarkCardProps) {
  const getRemainingDays = () => {
    if (!bookmark.deletedAt) return 30
    const deletedDate = new Date(bookmark.deletedAt)
    const now = new Date()
    const diffTime = 30 * 24 * 60 * 60 * 1000 - (now.getTime() - deletedDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const remainingDays = getRemainingDays()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {bookmark.favicon && (
              <img
                src={bookmark.favicon}
                alt=""
                className="w-4 h-4"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <h3 className="font-medium text-gray-900 truncate">{bookmark.title}</h3>
          </div>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-blue-500 truncate block mb-2"
          >
            {bookmark.url}
          </a>
          {bookmark.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {bookmark.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {bookmark.category && (
              <span
                className="px-2 py-0.5 rounded"
                style={{
                  backgroundColor: bookmark.category.color
                    ? `${bookmark.category.color}20`
                    : '#gray-100',
                  color: bookmark.category.color || '#6b7280',
                }}
              >
                {bookmark.category.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {remainingDays} 天后永久删除
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="打开链接"
          >
            <ExternalLink size={16} />
          </a>
          <button
            onClick={() => onRestore(bookmark.id)}
            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
            title="恢复书签"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={() => onPermanentDelete(bookmark.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="永久删除"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
