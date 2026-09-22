"use client";

const BILIBILI_URL = "https://space.bilibili.com/87874065";
const DOUYIN_URL = "#"; // 抖音主页链接待补充

export default function Footer() {
  return (
    <footer id="contact">
      <div className="social-icons">
        <a
          href={BILIBILI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          title="B站 · 绛洢Jin_"
        >
          <i className="fab fa-bilibili"></i>
        </a>
        <a href={DOUYIN_URL} className="social-icon" title="抖音 · 绛洢Jin_">
          <i className="fab fa-tiktok"></i>
        </a>
        <a href="#" className="social-icon" title="粉丝群 1053630553">
          <i className="fab fa-qq"></i>
        </a>
      </div>
      <div className="footer-links">
        <a href="/">首页</a>
        <a href="/explore">走进绛洢</a>
        <a href="/danganlib/danganlib.html">档案馆</a>
      </div>
      <p className="copyright">
        © 2026 绛洢Jin_ · SpRing <span className="motto">｜ 于尘世灰烬中，欢愉是唯一不灭的星火</span>
      </p>
    </footer>
  );
}
