export interface Category {
  id: string
  name: string
  icon?: string
  color?: string
  _count?: { bookmarks: number }
}

export interface Tag {
  id: string
  name: string
  color?: string
  _count?: { bookmarks: number }
}

export interface Bookmark {
  id: string
  title: string
  url: string
  description?: string
  favicon?: string
  clickCount: number
  lastClicked?: string
  isDeleted: boolean
  deletedAt?: string
  categoryId?: string
  category?: Category
  tags: Tag[]
  createdAt: string
  updatedAt: string
}

export type ViewMode = 'grid' | 'list'
export type SortBy = 'createdAt' | 'clickCount' | 'title'
export type SortOrder = 'asc' | 'desc'
