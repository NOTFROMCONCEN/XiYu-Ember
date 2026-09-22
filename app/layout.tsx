import type { Metadata } from "next";
import "./globals.css";
import FloatingButton from "@/components/FloatingButton";

export const metadata: Metadata = {
  title: "绛洢Jin_ | 于尘世灰烬中，欢愉是唯一不灭的星火",
  description:
    "虚拟主播「绛洢Jin_」官方网站 —— SpRing 所属 · 混沌养成系。于尘世灰烬中，欢愉是唯一不灭的星火。B站 / 抖音 @绛洢Jin_",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Noto+Serif+SC:wght@500;600;700;900&family=Noto+Sans+SC:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        {/* 全局悬浮按钮 */}
        <FloatingButton />
      </body>
    </html>
  );
}
