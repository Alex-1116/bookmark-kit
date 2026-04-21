"use client";

import { Category, Tag } from "@/types";
import Link from "next/link";

interface SidebarProps {
  categories: Category[];
  tags: Tag[];
  selectedCategory: number | null;
  selectedTag: number | null;
  onSelectCategory: (id: number | null) => void;
  onSelectTag: (id: number | null) => void;
  recentBookmarks: any[];
}

export default function Sidebar({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onSelectCategory,
  onSelectTag,
  recentBookmarks,
}: SidebarProps) {
  const getCategoryIcon = (slug: string) => {
    const icons: Record<string, string> = {
      work: "💼",
      study: "📚",
      entertainment: "🎮",
      tools: "🔧",
      other: "📁",
    };
    return icons[slug] || "📁";
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-5">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">🔖 Bookmark Kit</h1>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            最近访问
          </h3>
          {recentBookmarks.length > 0 ? (
            <div className="space-y-2">
              {recentBookmarks.map((bookmark) => (
                <Link
                  key={bookmark.id}
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600 truncate"
                >
                  {bookmark.title}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">暂无记录</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            分类
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => {
                onSelectCategory(null);
                onSelectTag(null);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedCategory === null && selectedTag === null
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>📋</span>
              <span className="font-medium">全部书签</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onSelectCategory(category.id);
                  onSelectTag(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{getCategoryIcon(category.slug)}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            标签
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  onSelectTag(tag.id);
                  onSelectCategory(null);
                }}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedTag === tag.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
