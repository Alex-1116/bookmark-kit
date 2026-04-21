export interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
  icon?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Bookmark {
  id: number;
  title: string;
  url: string;
  description?: string | null;
  categoryId?: number | null;
  category?: Category | null;
  tags?: { tag: Tag }[];
  clickCount: number;
  lastClicked?: string | null;
  createdAt: string;
}

export interface BookmarkFormData {
  title: string;
  url: string;
  description: string;
  categoryId: number | null;
  tagIds: number[];
}
