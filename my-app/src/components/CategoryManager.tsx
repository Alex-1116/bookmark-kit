'use client'

import { useState } from 'react'
import { Category } from '@/types'
import { Plus, Folder, X } from 'lucide-react'

interface CategoryManagerProps {
  categories: Category[]
  onCreateCategory: (name: string, color: string) => void
}

const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
]

const PRESET_CATEGORIES = ['工作', '学习', '娱乐', '工具', '其他']

export default function CategoryManager({
  categories,
  onCreateCategory,
}: CategoryManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCategoryName.trim()) {
      onCreateCategory(newCategoryName.trim(), selectedColor)
      setNewCategoryName('')
      setIsOpen(false)
    }
  }

  const existingNames = categories.map((c) => c.name)
  const availablePresets = PRESET_CATEGORIES.filter(
    (name) => !existingNames.includes(name)
  )

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Folder size={18} className="text-blue-500" />
          <h2 className="font-semibold text-gray-900">分类</h2>
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
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="新分类名称"
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
          {availablePresets.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">快速添加:</p>
              <div className="flex flex-wrap gap-2">
                {availablePresets.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setNewCategoryName(name)}
                    className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:border-blue-400"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      )}

      <div className="space-y-1">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color || '#e5e7eb' }}
              />
              <span className="text-sm text-gray-700">{category.name}</span>
            </div>
            <span className="text-xs text-gray-400">
              {category._count?.bookmarks || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
