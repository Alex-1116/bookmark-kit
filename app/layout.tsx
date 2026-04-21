import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bookmark Kit - 个人书签管理工具",
  description: "轻量级的个人书签管理工具，支持分类、标签、搜索和快速访问",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
