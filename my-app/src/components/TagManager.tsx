'use client'

import { useState } from 'react'
import { Tag } from '@/types'
import { Plus, TagIcon, X } from 'lucide-react'

interface TagManagerProps {
  tags: Tag[]
  onCreateTag: (name: string, color: string) => void
}

const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
]

export default function TagManager({ tags, onCreateTag }: TagManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTagName.trim()) {
      onCreateTag(newTagName.trim(), selectedColor)
      setNewTagName('')
      setIsOpen(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TagIcon size={18} className="text-blue-500" />
          <h2 className="font-semibold text-gray-900">标签</h2>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
        >
          <Plus size={18} />
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="新标签名称"
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              添加
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedColor === color ? 'border-gray-800' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm"
            style={{
              backgroundColor: tag.color ? `${tag.color}20` : '#e5e7eb',
              color: tag.color || '#374151',
            }}
          >
            <span>{tag.name}</span>
            <span className="text-xs opacity-70">({tag._count?.bookmarks || 0})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
