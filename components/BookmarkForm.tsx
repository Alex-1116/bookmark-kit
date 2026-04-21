"use client";

import { Bookmark, BookmarkFormData, Category, Tag } from "@/types";
import { useEffect, useState } from "react";

interface BookmarkFormProps {
  bookmark?: Bookmark;
  categories: Category[];
  tags: Tag[];
  onSubmit: (data: BookmarkFormData) => void;
  onCancel: () => void;
}

export default function BookmarkForm({
  bookmark,
  categories,
  tags: existingTags,
  onSubmit,
  onCancel,
}: BookmarkFormProps) {
  const [formData, setFormData] = useState<BookmarkFormData>({
    title: bookmark?.title || "",
    url: bookmark?.url || "",
    description: bookmark?.description || "",
    categoryId: bookmark?.categoryId || null,
    tagIds: bookmark?.tags?.map((t) => t.tag.id) || [],
  });
  const [newTagName, setNewTagName] = useState("");
  const [tags, setTags] = useState<Tag[]>(existingTags);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName.trim() }),
      });
      const tag = await response.json();
      setTags([...tags, tag]);
      setFormData({ ...formData, tagIds: [...formData.tagIds, tag.id] });
      setNewTagName("");
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  };

  const toggleTag = (tagId: number) => {
    if (formData.tagIds.includes(tagId)) {
      setFormData({
        ...formData,
        tagIds: formData.tagIds.filter((id) => id !== tagId),
      });
    } else {
      setFormData({ ...formData, tagIds: [...formData.tagIds, tagId] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          标题 *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="输入书签标题"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL *
        </label>
        <input
          type="url"
          required
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          描述
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="输入书签描述（可选）"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          分类
        </label>
        <select
          value={formData.categoryId || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              categoryId: e.target.value
                ? parseInt(e.target.value)
                : null,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">选择分类</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          标签
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                formData.tagIds.includes(tag.id)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleCreateTag())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入新标签名称"
          />
          <button
            type="button"
            onClick={handleCreateTag}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            添加
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          取消
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {bookmark ? "保存修改" : "添加书签"}
        </button>
      </div>
    </form>
  );
}
