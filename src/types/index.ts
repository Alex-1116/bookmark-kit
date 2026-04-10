export interface Category {
  id: string
  name: string
  icon: string | null
  color: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    bookmarks: number
  }
}

export interface Tag {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  _count?: {
    bookmarks: number
  }
}

export interface BookmarkTag {
  bookmarkId: string
  tagId: string
  tag: Tag
}

export interface Bookmark {
  id: string
  title: string
  url: string
  description: string | null
  clickCount: number
  isDeleted: boolean
  categoryId: string | null
  category: Category | null
  tags: BookmarkTag[]
  createdAt: string
  updatedAt: string
}
