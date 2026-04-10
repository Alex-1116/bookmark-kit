'use client'

import { Bookmark } from '@/types'
import { useState } from 'react'

interface BookmarkCardProps {
  bookmark: Bookmark
  viewMode: 'grid' | 'list'
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
  onRefresh: () => void
}

export default function BookmarkCard({
  bookmark,
  viewMode,
  onEdit,
  onDelete,
  onRefresh,
}: BookmarkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleClick = async () => {
    try {
      await fetch(`/api/bookmarks/${bookmark.id}/click`, {
        method: 'POST',
      })
      onRefresh()
      window.open(bookmark.url, '_blank')
    } catch (error) {
      console.error('Failed to record click:', error)
      window.open(bookmark.url, '_blank')
    }
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这个书签吗？')) return

    setIsDeleting(true)
    try {
      await fetch(`/api/bookmarks/${bookmark.id}`, {
        method: 'DELETE',
      })
      onDelete(bookmark.id)
    } catch (error) {
      console.error('Failed to delete bookmark:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=64`

  if (viewMode === 'list') {
    return (
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <img
            src={faviconUrl}
            alt=""
            className="w-6 h-6 rounded"
            onError={(e) => {
              e.currentTarget.src = '/file.svg'
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{bookmark.title}</h3>
            <p className="text-sm text-gray-500 truncate">{bookmark.url}</p>
          </div>
          {bookmark.category && (
            <span
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: bookmark.category.color ? bookmark.category.color + '20' : '#6B728020',
                color: bookmark.category.color || '#6B7280',
              }}
            >
              {bookmark.category.name}
            </span>
          )}
          <span className="text-sm text-gray-400">点击: {bookmark.clickCount}</span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleClick}
            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
          >
            访问
          </button>
          <button
            onClick={() => onEdit(bookmark)}
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            编辑
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
          >
            删除
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img
            src={faviconUrl}
            alt=""
            className="w-10 h-10 rounded"
            onError={(e) => {
              e.currentTarget.src = '/file.svg'
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{bookmark.title}</h3>
            <p className="text-sm text-gray-500 truncate">{new URL(bookmark.url).hostname}</p>
          </div>
        </div>

        {bookmark.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">{bookmark.description}</p>
        )}

        <div className="mt-3 flex flex-wrap gap-1">
          {bookmark.category && (
            <span
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: bookmark.category.color ? bookmark.category.color + '20' : '#6B728020',
                color: bookmark.category.color || '#6B7280',
              }}
            >
              {bookmark.category.name}
            </span>
          )}
          {bookmark.tags.map((bt) => (
            <span
              key={bt.tagId}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {bt.tag.name}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-400">点击: {bookmark.clickCount}</span>
          <div className="flex gap-2">
            <button
              onClick={handleClick}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              访问
            </button>
            <button
              onClick={() => onEdit(bookmark)}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              编辑
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
