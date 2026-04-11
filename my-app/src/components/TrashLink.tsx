'use client'

import { Trash2 } from 'lucide-react'
import Link from 'next/link'

interface TrashLinkProps {
  count?: number
}

export default function TrashLink({ count }: TrashLinkProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">快捷操作</h3>
      <Link
        href="/trash"
        className="flex items-center justify-between p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <Trash2 size={18} className="text-gray-400" />
          <span className="text-sm">回收站</span>
        </div>
        {count !== undefined && count > 0 && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </Link>
    </div>
  )
}
