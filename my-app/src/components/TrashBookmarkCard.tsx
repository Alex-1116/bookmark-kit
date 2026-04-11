'use client'

import { Bookmark } from '@/types'
import { RefreshCw, Trash2, Clock, Globe } from 'lucide-react'

interface TrashBookmarkCardProps {
  bookmark: Bookmark
  onRestore: (id: string) => void
  onPermanentDelete: (id: string) => void
  viewMode: 'grid' | 'list'
}

export default function TrashBookmarkCard({
  bookmark,
  onRestore,
  onPermanentDelete,
  viewMode,
}: TrashBookmarkCardProps) {
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    } catch {
      return '/globe.svg'
    }
  }

  const formatDeletedDate = (deletedAt: string | Date | null | undefined) => {
    if (!deletedAt) return '未知'
    const date = new Date(deletedAt)
    const now = new Date()
    const diffDays = Math.ceil(
      (30 * 24 * 60 * 60 * 1000 - (now.getTime() - date.getTime())) /
        (1000 * 60 * 60 * 24)
    )
    return `剩余 ${Math.max(0, diffDays)} 天自动删除`
  }

  if (viewMode === 'list') {
    return (
      <div className="group flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-75">
        <img
          src={getFaviconUrl(bookmark.url)}
          alt=""
          className="w-10 h-10 rounded grayscale"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = '/globe.svg'
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-600 truncate">
            {bookmark.title}
          </h3>
          <p className="text-sm text-gray-400 truncate">{bookmark.url}</p>
          {bookmark.description && (
            <p className="text-sm text-gray-400 truncate mt-1">
              {bookmark.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Clock size={14} />
            <span>{formatDeletedDate(bookmark.deletedAt)}</span>
          </div>
          {bookmark.category && (
            <span
              className="px-2 py-1 text-xs rounded-full grayscale"
              style={{
                backgroundColor: bookmark.category.color || '#e5e7eb',
                color: bookmark.category.color ? '#fff' : '#374151',
              }}
            >
              {bookmark.category.name}
            </span>
          )}
          <button
            onClick={() => onRestore(bookmark.id)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
            title="恢复书签到原分类"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => onPermanentDelete(bookmark.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="永久删除"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-gray-50 rounded-lg border border-gray-200 overflow-hidden opacity-75">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img
            src={getFaviconUrl(bookmark.url)}
            alt=""
            className="w-12 h-12 rounded grayscale"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = '/globe.svg'
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-600 truncate">
              {bookmark.title}
            </h3>
            <p className="text-sm text-gray-400 truncate">{bookmark.url}</p>
          </div>
        </div>
        {bookmark.description && (
          <p className="text-sm text-gray-400 mt-3 line-clamp-2">
            {bookmark.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {bookmark.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 text-xs rounded-full grayscale"
              style={{
                backgroundColor: tag.color || '#e5e7eb',
                color: tag.color ? '#fff' : '#374151',
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-100 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Clock size={14} />
            <span>{formatDeletedDate(bookmark.deletedAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {bookmark.category && (
            <span
              className="px-2 py-1 text-xs rounded-full grayscale mr-2"
              style={{
                backgroundColor: bookmark.category.color || '#e5e7eb',
                color: bookmark.category.color ? '#fff' : '#374151',
              }}
            >
              {bookmark.category.name}
            </span>
          )}
          <button
            onClick={() => onRestore(bookmark.id)}
            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
            title="恢复书签到原分类"
          >
            <RefreshCw size={16} />
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
