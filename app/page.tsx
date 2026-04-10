"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkFormData, Category, Tag } from "@/types";
import BookmarkCard from "@/components/BookmarkCard";
import BookmarkForm from "@/components/BookmarkForm";
import Modal from "@/components/Modal";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [recentBookmarks, setRecentBookmarks] = useState<Bookmark[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = async () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("categoryId", selectedCategory.toString());
    if (selectedTag) params.set("tagId", selectedTag.toString());
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);

    const response = await fetch(`/api/bookmarks?${params}`);
    const data = await response.json();
    setBookmarks(data);
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    const response = await fetch("/api/categories");
    const data = await response.json();
    setCategories(data);
  };

  const fetchTags = async () => {
    const response = await fetch("/api/tags");
    const data = await response.json();
    setTags(data);
  };

  const fetchRecentBookmarks = async () => {
    const response = await fetch("/api/bookmarks/recent");
    const data = await response.json();
    setRecentBookmarks(data);
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchRecentBookmarks();
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [searchQuery, selectedCategory, selectedTag, sortBy, sortOrder]);

  const handleAddBookmark = async (data: BookmarkFormData) => {
    await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchBookmarks();
    fetchTags();
    setIsModalOpen(false);
  };

  const handleEditBookmark = async (data: BookmarkFormData) => {
    if (!editingBookmark) return;
    await fetch(`/api/bookmarks/${editingBookmark.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchBookmarks();
    fetchTags();
    setIsModalOpen(false);
    setEditingBookmark(undefined);
  };

  const handleDeleteBookmark = async (id: number) => {
    if (confirm("确定要删除这个书签吗？")) {
      await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      fetchBookmarks();
    }
  };

  const openAddModal = () => {
    setEditingBookmark(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    setSearchQuery("");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        categories={categories}
        tags={tags}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        onSelectCategory={setSelectedCategory}
        onSelectTag={setSelectedTag}
        recentBookmarks={recentBookmarks}
      />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCategory
                  ? categories.find((c) => c.id === selectedCategory)?.name
                  : selectedTag
                  ? `标签: ${tags.find((t) => t.id === selectedTag)?.name}`
                  : "全部书签"}
              </h1>
              <p className="text-gray-500 mt-1">共 {bookmarks.length} 个书签</p>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              添加书签
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索书签..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="createdAt">按添加时间</option>
              <option value="clickCount">按点击量</option>
              <option value="title">按标题</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>

            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {(selectedCategory || selectedTag || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                清除筛选
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📑</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无书签</h3>
            <p className="text-gray-500 mb-4">点击上方按钮添加你的第一个书签</p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              添加书签
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                viewMode={viewMode}
                onEdit={openEditModal}
                onDelete={handleDeleteBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                viewMode={viewMode}
                onEdit={openEditModal}
                onDelete={handleDeleteBookmark}
              />
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBookmark(undefined);
        }}
        title={editingBookmark ? "编辑书签" : "添加书签"}
      >
        <BookmarkForm
          bookmark={editingBookmark}
          categories={categories}
          tags={tags}
          onSubmit={editingBookmark ? handleEditBookmark : handleAddBookmark}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingBookmark(undefined);
          }}
        />
      </Modal>
    </div>
  );
}
