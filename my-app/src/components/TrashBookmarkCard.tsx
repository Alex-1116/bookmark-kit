'use client'

import { Bookmark } from '@/types'
import { RotateCcw, Trash2, Clock, Calendar } from 'lucide-react'

interface TrashBookmarkCardProps {
  bookmark: Bookmark
  remainingDays: number
  onRestore: (id: string) => void
  onDelete: (id: string) => void
}

export default function TrashBookmarkCard({
  bookmark,
  remainingDays,
  onRestore,
  onDelete,
}: TrashBookmarkCardProps) {
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    } catch {
      return '/globe.svg'
    }
  }

  const formatDeletedAt = (deletedAt: string) => {
    const date = new Date(deletedAt)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="group flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
      {/* 图标 */}
      <img
        src={getFaviconUrl(bookmark.url)}
        alt=""
        className="w-12 h-12 rounded flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/globe.svg'
        }}
      />

      {/* 内容区域 */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">
          {bookmark.title}
        </h3>
        <p className="text-sm text-gray-500 truncate">{bookmark.url}</p>

        {/* 元信息 */}
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            删除于 {formatDeletedAt(bookmark.deletedAt!)}
          </span>
          {bookmark.category && (
            <span
              className="px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: bookmark.category.color
                  ? `${bookmark.category.color}20`
                  : '#f3f4f6',
                color: bookmark.category.color || '#6b7280',
              }}
            >
              {bookmark.category.name}
            </span>
          )}
        </div>
      </div>

      {/* 剩余天数提示 */}
      <div className="flex-shrink-0 text-right">
        <div
          className={`flex items-center gap-1 text-sm ${
            remainingDays <= 3
              ? 'text-red-600'
              : remainingDays <= 7
                ? 'text-yellow-600'
                : 'text-gray-500'
          }`}
        >
          <Clock size={14} />
          <span>{remainingDays} 天后自动删除</span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onRestore(bookmark.id)}
          className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="恢复书签"
        >
          <RotateCcw size={16} />
          <span className="hidden sm:inline">恢复</span>
        </button>
        <button
          onClick={() => onDelete(bookmark.id)}
          className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="永久删除"
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">删除</span>
        </button>
      </div>
    </div>
  )
}
