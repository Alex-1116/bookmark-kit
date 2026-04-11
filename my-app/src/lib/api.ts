import { Bookmark, Category, Tag } from '@/types'

const API_BASE = '/api'

export async function fetchBookmarks(params?: {
  search?: string
  categoryId?: string
  tagId?: string
  sortBy?: string
  order?: string
}): Promise<Bookmark[]> {
  const queryParams = new URLSearchParams()
  if (params?.search) queryParams.set('search', params.search)
  if (params?.categoryId) queryParams.set('categoryId', params.categoryId)
  if (params?.tagId) queryParams.set('tagId', params.tagId)
  if (params?.sortBy) queryParams.set('sortBy', params.sortBy)
  if (params?.order) queryParams.set('order', params.order)

  const res = await fetch(`${API_BASE}/bookmarks?${queryParams}`)
  if (!res.ok) throw new Error('Failed to fetch bookmarks')
  return res.json()
}

export async function fetchRecentBookmarks(): Promise<Bookmark[]> {
  const res = await fetch(`${API_BASE}/bookmarks/recent`)
  if (!res.ok) throw new Error('Failed to fetch recent bookmarks')
  return res.json()
}

export async function createBookmark(data: {
  title: string
  url: string
  description?: string
  categoryId?: string
  tagIds?: string[]
}): Promise<Bookmark> {
  const res = await fetch(`${API_BASE}/bookmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create bookmark')
  return res.json()
}

export async function updateBookmark(
  id: string,
  data: {
    title: string
    url: string
    description?: string
    categoryId?: string
    tagIds?: string[]
  }
): Promise<Bookmark> {
  const res = await fetch(`${API_BASE}/bookmarks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update bookmark')
  return res.json()
}

export async function deleteBookmark(id: string): Promise<Bookmark> {
  const res = await fetch(`${API_BASE}/bookmarks/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete bookmark')
  return res.json()
}

export async function recordClick(id: string): Promise<Bookmark> {
  const res = await fetch(`${API_BASE}/bookmarks/${id}/click`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error('Failed to record click')
  return res.json()
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`)
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

export async function createCategory(data: {
  name: string
  icon?: string
  color?: string
}): Promise<Category> {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create category')
  return res.json()
}

export async function fetchTags(): Promise<Tag[]> {
  const res = await fetch(`${API_BASE}/tags`)
  if (!res.ok) throw new Error('Failed to fetch tags')
  return res.json()
}

export async function createTag(data: {
  name: string
  color?: string
}): Promise<Tag> {
  const res = await fetch(`${API_BASE}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create tag')
  return res.json()
}

export async function fetchTrashedBookmarks(): Promise<Bookmark[]> {
  const res = await fetch(`${API_BASE}/bookmarks/trashed`)
  if (!res.ok) throw new Error('Failed to fetch trashed bookmarks')
  return res.json()
}

export async function restoreBookmark(id: string): Promise<Bookmark> {
  const res = await fetch(`${API_BASE}/bookmarks/${id}/restore`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error('Failed to restore bookmark')
  return res.json()
}

export async function permanentDeleteBookmark(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/bookmarks/${id}/permanent-delete`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to permanently delete bookmark')
}

export async function cleanupTrashedBookmarks(): Promise<{
  success: boolean
  deletedCount: number
}> {
  const res = await fetch(`${API_BASE}/cron/cleanup-trashed`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error('Failed to cleanup trashed bookmarks')
  return res.json()
}
