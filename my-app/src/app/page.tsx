'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bookmark, Category, Tag, ViewMode, SortBy, SortOrder } from '@/types'
import {
  fetchBookmarks,
  fetchRecentBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  fetchCategories,
  createCategory,
  fetchTags,
  createTag,
} from '@/lib/api'
import BookmarkCard from '@/components/BookmarkCard'
import BookmarkForm from '@/components/BookmarkForm'
import SearchFilter from '@/components/SearchFilter'
import RecentBookmarks from '@/components/RecentBookmarks'
import CategoryManager from '@/components/CategoryManager'
import TagManager from '@/components/TagManager'
import { Plus, BookmarkIcon, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [recentBookmarks, setRecentBookmarks] = useState<Bookmark[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortBy>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)

  const loadData = useCallback(async () => {
    try {
      const [bookmarksData, recentData, categoriesData, tagsData] =
        await Promise.all([
          fetchBookmarks({
            search,
            categoryId: selectedCategory,
            tagId: selectedTag,
            sortBy,
            order: sortOrder,
          }),
          fetchRecentBookmarks(),
          fetchCategories(),
          fetchTags(),
        ])
      setBookmarks(bookmarksData)
      setRecentBookmarks(recentData)
      setCategories(categoriesData)
      setTags(tagsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }, [search, selectedCategory, selectedTag, sortBy, sortOrder])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCreateBookmark = async (data: {
    title: string
    url: string
    description: string
    categoryId: string
    tagIds: string[]
  }) => {
    try {
      await createBookmark(data)
      setIsFormOpen(false)
      loadData()
    } catch (error) {
      console.error('Failed to create bookmark:', error)
    }
  }

  const handleUpdateBookmark = async (data: {
    title: string
    url: string
    description: string
    categoryId: string
    tagIds: string[]
  }) => {
    if (!editingBookmark) return
    try {
      await updateBookmark(editingBookmark.id, data)
      setEditingBookmark(null)
      loadData()
    } catch (error) {
      console.error('Failed to update bookmark:', error)
    }
  }

  const handleDeleteBookmark = async (id: string) => {
    if (!confirm('确定要删除这个书签吗？')) return
    try {
      await deleteBookmark(id)
      loadData()
    } catch (error) {
      console.error('Failed to delete bookmark:', error)
    }
  }

  const handleCreateCategory = async (name: string, color: string) => {
    try {
      await createCategory({ name, color })
      loadData()
    } catch (error) {
      console.error('Failed to create category:', error)
    }
  }

  const handleCreateTag = async (name: string, color: string) => {
    try {
      await createTag({ name, color })
      loadData()
    } catch (error) {
      console.error('Failed to create tag:', error)
    }
  }

  const openCreateForm = () => {
    setEditingBookmark(null)
    setIsFormOpen(true)
  }

  const openEditForm = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingBookmark(null)
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
            <div className="flex items-center gap-2">
              <BookmarkIcon className="text-blue-500" size={28} />
              <h1 className="text-xl font-bold text-gray-900">我的书签</h1>
            </div>
            <button
              onClick={openCreateForm}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">添加书签</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <SearchFilter
              search={search}
              onSearchChange={setSearch}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              categories={categories}
              tags={tags}
            />

            {bookmarks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <BookmarkIcon
                  className="mx-auto text-gray-300 mb-4"
                  size={48}
                />
                <p className="text-gray-500 mb-4">还没有书签</p>
                <button
                  onClick={openCreateForm}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  添加第一个书签
                </button>
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
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    viewMode={viewMode}
                    onEdit={openEditForm}
                    onDelete={handleDeleteBookmark}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <RecentBookmarks bookmarks={recentBookmarks} />
            <CategoryManager
              categories={categories}
              onCreateCategory={handleCreateCategory}
            />
            <TagManager tags={tags} onCreateTag={handleCreateTag} />
            
            <Link
              href="/trash"
              className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <Trash2 size={18} className="text-gray-500" />
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">回收站</h2>
                <p className="text-xs text-gray-500">已删除的书签</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {isFormOpen && (
        <BookmarkForm
          bookmark={editingBookmark}
          categories={categories}
          tags={tags}
          onSubmit={
            editingBookmark ? handleUpdateBookmark : handleCreateBookmark
          }
          onCancel={closeForm}
        />
      )}
    </div>
  )
}
