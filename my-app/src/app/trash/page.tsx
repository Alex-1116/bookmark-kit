'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bookmark } from '@/types'
import {
  fetchTrashedBookmarks,
  restoreBookmark,
  permanentlyDeleteBookmark,
} from '@/lib/api'
import TrashBookmarkCard from '@/components/TrashBookmarkCard'
import { Trash2, ArrowLeft, RotateCcw, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function TrashPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  const loadTrashedBookmarks = useCallback(async () => {
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
    loadTrashedBookmarks()
  }, [loadTrashedBookmarks])

  const handleRestore = async (id: string) => {
    try {
      await restoreBookmark(id)
      setBookmarks((prev) => prev.filter((b) => b.id !== id))
    } catch (error) {
      console.error('Failed to restore bookmark:', error)
      alert('恢复书签失败')
    }
  }

  const handlePermanentDelete = async (id: string) => {
    if (!confirm('确定要永久删除这个书签吗？此操作不可恢复。')) return
    try {
      await permanentlyDeleteBookmark(id)
      setBookmarks((prev) => prev.filter((b) => b.id !== id))
    } catch (error) {
      console.error('Failed to permanently delete bookmark:', error)
      alert('删除书签失败')
    }
  }

  const handleRestoreAll = async () => {
    if (bookmarks.length === 0) return
    if (!confirm(`确定要恢复全部 ${bookmarks.length} 个书签吗？`)) return

    try {
      await Promise.all(bookmarks.map((b) => restoreBookmark(b.id)))
      setBookmarks([])
    } catch (error) {
      console.error('Failed to restore all bookmarks:', error)
      alert('批量恢复失败')
    }
  }

  const handleEmptyTrash = async () => {
    if (bookmarks.length === 0) return
    if (!confirm(`确定要清空回收站吗？这将永久删除 ${bookmarks.length} 个书签，不可恢复。`))
      return

    try {
      await Promise.all(bookmarks.map((b) => permanentlyDeleteBookmark(b.id)))
      setBookmarks([])
    } catch (error) {
      console.error('Failed to empty trash:', error)
      alert('清空回收站失败')
    }
  }

  // 计算剩余天数
  const getRemainingDays = (deletedAt: string) => {
    const deleted = new Date(deletedAt).getTime()
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
    const remainingMs = deleted + thirtyDaysMs - Date.now()
    const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000))
    return Math.max(0, remainingDays)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>返回</span>
              </Link>
              <div className="flex items-center gap-2">
                <Trash2 className="text-gray-500" size={24} />
                <h1 className="text-xl font-bold text-gray-900">回收站</h1>
              </div>
            </div>
            {bookmarks.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestoreAll}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <RotateCcw size={18} />
                  <span className="hidden sm:inline">全部恢复</span>
                </button>
                <button
                  onClick={handleEmptyTrash}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                  <span className="hidden sm:inline">清空回收站</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 提示信息 */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-700">
            <p className="font-medium">回收站说明</p>
            <p className="mt-1">
              已删除的书签将保留30天，之后会自动永久删除。您可以随时恢复或永久删除这些书签。
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Trash2 className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">回收站是空的</p>
            <p className="text-sm text-gray-400 mt-2">
              删除的书签将在这里显示，保留30天
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bookmark) => (
              <TrashBookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                remainingDays={getRemainingDays(bookmark.deletedAt!)}
                onRestore={handleRestore}
                onDelete={handlePermanentDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
