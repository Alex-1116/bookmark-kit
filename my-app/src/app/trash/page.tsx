'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bookmark, ViewMode } from '@/types'
import {
  fetchTrashedBookmarks,
  restoreBookmark,
  permanentDeleteBookmark,
} from '@/lib/api'
import TrashBookmarkCard from '@/components/TrashBookmarkCard'
import { Trash2, ArrowLeft, BookmarkIcon, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function TrashPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const loadData = useCallback(async () => {
    try {
      const data = await fetchTrashedBookmarks()
      setBookmarks(data)
    } catch (error) {
      console.error('Failed to load trashed bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleRestore = async (id: string) => {
    if (!confirm('确定要恢复这个书签吗？')) return
    try {
      await restoreBookmark(id)
      loadData()
    } catch (error) {
      console.error('Failed to restore bookmark:', error)
    }
  }

  const handlePermanentDelete = async (id: string) => {
    if (!confirm('确定要永久删除这个书签吗？此操作不可撤销！')) return
    try {
      await permanentDeleteBookmark(id)
      loadData()
    } catch (error) {
      console.error('Failed to permanently delete bookmark:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </Link>
              <div className="flex items-center gap-2">
                <Trash2 className="text-gray-500" size={28} />
                <h1 className="text-xl font-bold text-gray-900">回收站</h1>
                <span className="text-sm text-gray-500">
                  ({bookmarks.length} 项)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>提示：</strong>回收站中的书签将保留 30 天，到期后将自动永久删除。
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Trash2
              className="mx-auto text-gray-300 mb-4"
              size={48}
            />
            <p className="text-gray-500 mb-2">回收站为空</p>
            <p className="text-gray-400 text-sm mb-4">删除的书签将在这里保留 30 天</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <BookmarkIcon size={18} />
              返回书签列表
            </Link>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
            }
          >
            {bookmarks.map((bookmark) => (
              <TrashBookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                viewMode={viewMode}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
