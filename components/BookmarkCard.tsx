"use client";

import { Bookmark } from "@/types";
import Link from "next/link";

interface BookmarkCardProps {
  bookmark: Bookmark;
  viewMode: "grid" | "list";
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: number) => void;
}

export default function BookmarkCard({
  bookmark,
  viewMode,
  onEdit,
  onDelete,
}: BookmarkCardProps) {
  const handleClick = async () => {
    try {
      await fetch(`/api/bookmarks/${bookmark.id}/click`, { method: "POST" });
    } catch (error) {
      console.error("Failed to record click:", error);
    }
  };

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=64`;

  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <img
          src={faviconUrl}
          alt=""
          className="w-8 h-8 rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E";
          }}
        />
        <div className="flex-1 min-w-0">
          <Link
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="block font-medium text-gray-900 hover:text-blue-600 truncate"
          >
            {bookmark.title}
          </Link>
          <p className="text-sm text-gray-500 truncate">{bookmark.url}</p>
        </div>
        {bookmark.category && (
          <span
            className="px-2 py-1 text-xs rounded-full text-white whitespace-nowrap"
            style={{ backgroundColor: bookmark.category.color }}
          >
            {bookmark.category.name}
          </span>
        )}
        <span className="text-sm text-gray-400 whitespace-nowrap">
          {bookmark.clickCount} 次点击
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(bookmark)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
          >
            编辑
          </button>
          <button
            onClick={() => onDelete(bookmark.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
          >
            删除
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <img
          src={faviconUrl}
          alt=""
          className="w-10 h-10 rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E";
          }}
        />
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(bookmark)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(bookmark.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <Link
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block"
      >
        <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 line-clamp-1">
          {bookmark.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-1">{bookmark.url}</p>
        {bookmark.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{bookmark.description}</p>
        )}
      </Link>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {bookmark.category && (
            <span
              className="px-2 py-0.5 text-xs rounded-full text-white"
              style={{ backgroundColor: bookmark.category.color }}
            >
              {bookmark.category.name}
            </span>
          )}
          {bookmark.tags?.slice(0, 2).map(({ tag }) => (
            <span key={tag.id} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
              {tag.name}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-400">{bookmark.clickCount} 次</span>
      </div>
    </div>
  );
}
