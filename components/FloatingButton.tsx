"use client";

import { useState, useCallback, useEffect } from "react";

export default function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  // ESC 关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  // 点击遮罩关闭
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const links = [
    { href: "/explore", label: "走进绛洢的世界" },
    { href: "https://space.bilibili.com/87874065", label: "绛洢Jin_的B站主页", external: true },
    { href: "https://sakuraovo.site/", label: "打开博客", external: true },
    { href: "https://see-new-vup.eo.website.nyanon.online/", label: "带我去看别的虚拟主播", external: true },
  ];

  return (
    <>
      {/* 右下角 "看看更多" 按钮 */}
      <button className="floating-btn" onClick={openModal}>
        看看更多
      </button>

      {/* 对话框 */}
      <div
        className={`modal-overlay ${isOpen ? "active" : ""}`}
        onClick={handleOverlayClick}
      >
        <div className="modal-content">
          <button className="close-btn" onClick={closeModal}>
            &times;
          </button>
          <p style={{ marginBottom: "8px", fontSize: "1.1em" }}>发现更多精彩</p>
          <p style={{ fontSize: "0.85em", color: "#83705e", marginBottom: "20px" }}>
            power by 想单推坏女人的话梅糖
          </p>
          <div className="modal-buttons">
            {links.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-btn"
                  onClick={closeModal}
                >
                  {link.label}
                </a>
              ) : (
                <a key={link.href} href={link.href} className="modal-btn" onClick={closeModal}>
                  {link.label}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
