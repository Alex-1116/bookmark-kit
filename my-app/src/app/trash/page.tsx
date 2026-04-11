'use client'

import { useState, useEffect } from 'react'
import { Bookmark } from '@/types'
import { fetchTrashedBookmarks, restoreBookmark, permanentDeleteBookmark } from '@/lib/api'
import { TrashBookmarkCard } from '@/components/TrashBookmarkCard'
import { Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TrashPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const data = await fetchTrashedBookmarks()
      setBookmarks(data)
    } catch (error) {
      console.error('Failed to load trashed bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRestore = async (id: string) => {
    if (!confirm('确定要恢复这个书签吗？')) return
    try {
      await restoreBookmark(id)
      setBookmarks(bookmarks.filter((b) => b.id !== id))
    } catch (error) {
      console.error('Failed to restore bookmark:', error)
    }
  }

  const handlePermanentDelete = async (id: string) => {
    if (!confirm('确定要永久删除这个书签吗？此操作不可恢复！')) return
    try {
      await permanentDeleteBookmark(id)
      setBookmarks(bookmarks.filter((b) => b.id !== id))
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
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </Link>
              <div className="flex items-center gap-2">
                <Trash2 className="text-red-500" size={24} />
                <h1 className="text-xl font-bold text-gray-900">回收站</h1>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {bookmarks.length} 个书签 · 30天后自动清理
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {bookmarks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Trash2 className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">回收站是空的</p>
            <Link
              href="/"
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              返回书签列表
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bookmark) => (
              <TrashBookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
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
