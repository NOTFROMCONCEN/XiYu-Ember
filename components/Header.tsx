"use client";

import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "首页" },
    { href: "/explore", label: "走进绛洢" },
    { href: "/danganlib/danganlib.html", label: "档案馆", special: true },
    { href: "/about.html", label: "关于" },
  ];

  return (
    <header>
      <div className="logo">
        绛洢 <span className="ember-text">Jin_</span>
      </div>
      <nav className={`nav-links ${menuOpen ? "active" : ""}`} id="main-nav">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={link.special ? "special-link" : ""}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div
        className="menu-toggle"
        id="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <style jsx>{`
        .menu-toggle {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 5px;
        }
        .bar {
          width: 25px;
          height: 3px;
          background: #bdaa97;
          border-radius: 3px;
          transition: 0.3s;
        }
        @media (max-width: 768px) {
          .menu-toggle {
            display: flex;
          }
          .nav-links {
            display: none;
            position: absolute;
            top: 70px;
            right: 5%;
            background: rgba(20, 14, 9, 0.96);
            flex-direction: column;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(232, 182, 76, 0.2);
            backdrop-filter: blur(10px);
          }
          .nav-links.active {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
