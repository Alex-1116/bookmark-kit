'use client'

import { Category, Tag } from '@/types'

interface SearchFilterProps {
  search: string
  onSearchChange: (value: string) => void
  categoryId: string
  onCategoryChange: (value: string) => void
  tagId: string
  onTagChange: (value: string) => void
  sortBy: string
  onSortByChange: (value: string) => void
  sortOrder: string
  onSortOrderChange: (value: string) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (value: 'grid' | 'list') => void
  categories: Category[]
  tags: Tag[]
  onAddClick: () => void
}

export default function SearchFilter({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  tagId,
  onTagChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  viewMode,
  onViewModeChange,
  categories,
  tags,
  onAddClick,
}: SearchFilterProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索标题、URL 或描述..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">所有分类</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} ({category._count?.bookmarks || 0})
            </option>
          ))}
        </select>

        <select
          value={tagId}
          onChange={(e) => onTagChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">所有标签</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name} ({tag._count?.bookmarks || 0})
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="createdAt">按添加时间</option>
          <option value="clickCount">按点击量</option>
          <option value="title">按标题</option>
        </select>

        <button
          onClick={() => onSortOrderChange(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          title={sortOrder === 'desc' ? '降序' : '升序'}
        >
          {sortOrder === 'desc' ? '↓' : '↑'}
        </button>

        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}
          >
            网格
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}
          >
            列表
          </button>
        </div>

        <button
          onClick={onAddClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          添加书签
        </button>
      </div>
    </div>
  )
}
