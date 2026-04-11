'use client'

import { Bookmark } from '@/types'
import { recordClick } from '@/lib/api'
import { ExternalLink, Edit, Trash2, MousePointerClick } from 'lucide-react'

interface BookmarkCardProps {
  bookmark: Bookmark
  viewMode: 'grid' | 'list'
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
}

export default function BookmarkCard({
  bookmark,
  viewMode,
  onEdit,
  onDelete,
}: BookmarkCardProps) {
  const handleClick = async () => {
    await recordClick(bookmark.id)
    window.open(bookmark.url, '_blank')
  }

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    } catch {
      return '/globe.svg'
    }
  }

  if (viewMode === 'list') {
    return (
      <div className="group flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all">
        <img
          src={getFaviconUrl(bookmark.url)}
          alt=""
          className="w-10 h-10 rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/globe.svg'
          }}
        />
        <div className="flex-1 min-w-0">
          <h3
            className="font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600"
            onClick={handleClick}
          >
            {bookmark.title}
          </h3>
          <p className="text-sm text-gray-500 truncate">{bookmark.url}</p>
          {bookmark.description && (
            <p className="text-sm text-gray-400 truncate mt-1">
              {bookmark.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {bookmark.category && (
            <span
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: bookmark.category.color || '#e5e7eb',
                color: bookmark.category.color ? '#fff' : '#374151',
              }}
            >
              {bookmark.category.name}
            </span>
          )}
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <MousePointerClick size={14} />
            <span>{bookmark.clickCount}</span>
          </div>
          <button
            onClick={() => onEdit(bookmark)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(bookmark.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img
            src={getFaviconUrl(bookmark.url)}
            alt=""
            className="w-12 h-12 rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/globe.svg'
            }}
          />
          <div className="flex-1 min-w-0">
            <h3
              className="font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600"
              onClick={handleClick}
            >
              {bookmark.title}
            </h3>
            <p className="text-sm text-gray-500 truncate">{bookmark.url}</p>
          </div>
        </div>
        {bookmark.description && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
            {bookmark.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {bookmark.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 text-xs rounded-full"
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
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {bookmark.category && (
            <span
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: bookmark.category.color || '#e5e7eb',
                color: bookmark.category.color ? '#fff' : '#374151',
              }}
            >
              {bookmark.category.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 text-gray-400 text-sm mr-2">
            <MousePointerClick size={14} />
            <span>{bookmark.clickCount}</span>
          </div>
          <button
            onClick={handleClick}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
          >
            <ExternalLink size={16} />
          </button>
          <button
            onClick={() => onEdit(bookmark)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(bookmark.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
