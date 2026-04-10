'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bookmark, Category, Tag } from '@/types'
import SearchFilter from '@/components/SearchFilter'
import BookmarkList from '@/components/BookmarkList'
import BookmarkForm from '@/components/BookmarkForm'
import RecentBookmarks from '@/components/RecentBookmarks'

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [recentBookmarks, setRecentBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [tagId, setTagId] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [showForm, setShowForm] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)

  const fetchBookmarks = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (categoryId) params.append('categoryId', categoryId)
      if (tagId) params.append('tagId', tagId)
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)

      const response = await fetch(`/api/bookmarks?${params.toString()}`)
      const data = await response.json()
      setBookmarks(data)
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error)
    }
  }, [search, categoryId, tagId, sortBy, sortOrder])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }, [])

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch('/api/tags')
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    }
  }, [])

  const fetchRecentBookmarks = useCallback(async () => {
    try {
      const response = await fetch('/api/bookmarks/recent')
      const data = await response.json()
      setRecentBookmarks(data)
    } catch (error) {
      console.error('Failed to fetch recent bookmarks:', error)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await Promise.all([fetchCategories(), fetchTags(), fetchRecentBookmarks()])
      setLoading(false)
    }
    init()
  }, [fetchCategories, fetchTags, fetchRecentBookmarks])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  const handleAddClick = () => {
    setEditingBookmark(null)
    setShowForm(true)
  }

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id))
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingBookmark(null)
  }

  const handleFormSave = () => {
    fetchBookmarks()
    fetchCategories()
    fetchTags()
    fetchRecentBookmarks()
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">书签管理</h1>
          <p className="text-gray-500 mt-1">管理你的网页书签，快速访问常用链接</p>
        </header>

        <RecentBookmarks bookmarks={recentBookmarks} />

        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          tagId={tagId}
          onTagChange={setTagId}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          categories={categories}
          tags={tags}
          onAddClick={handleAddClick}
        />

        <BookmarkList
          bookmarks={bookmarks}
          viewMode={viewMode}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={fetchBookmarks}
        />

        {showForm && (
          <BookmarkForm
            bookmark={editingBookmark}
            categories={categories}
            tags={tags}
            onClose={handleFormClose}
            onSave={handleFormSave}
          />
        )}
      </div>
    </div>
  )
}
