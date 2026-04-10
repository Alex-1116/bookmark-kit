'use client'

import { Bookmark } from '@/types'
import BookmarkCard from './BookmarkCard'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  viewMode: 'grid' | 'list'
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
  onRefresh: () => void
}

export default function BookmarkList({
  bookmarks,
  viewMode,
  onEdit,
  onDelete,
  onRefresh,
}: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">暂无书签</p>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            viewMode={viewMode}
            onEdit={onEdit}
            onDelete={onDelete}
            onRefresh={onRefresh}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          viewMode={viewMode}
          onEdit={onEdit}
          onDelete={onDelete}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  )
}
