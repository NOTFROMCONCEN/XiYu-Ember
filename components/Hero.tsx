"use client";

const BILIBILI_URL = "https://space.bilibili.com/87874065";
const DOUYIN_URL = "#"; // 抖音主页链接待补充

// 火星粒子参数：left(%) / 尺寸(px) / 时长(s) / 延迟(s) / 水平漂移(px)
const particles = [
  { left: 4, size: 5, duration: 11, delay: 0, drift: 60 },
  { left: 11, size: 3, duration: 14, delay: 2.5, drift: -40 },
  { left: 18, size: 6, duration: 10, delay: 5, drift: 80 },
  { left: 26, size: 4, duration: 13, delay: 1.2, drift: -70 },
  { left: 33, size: 5, duration: 12, delay: 7, drift: 50 },
  { left: 41, size: 3, duration: 15, delay: 3.8, drift: -30 },
  { left: 48, size: 7, duration: 9.5, delay: 0.8, drift: 90 },
  { left: 56, size: 4, duration: 12.5, delay: 6.2, drift: -55 },
  { left: 63, size: 5, duration: 10.5, delay: 2, drift: 65 },
  { left: 71, size: 3, duration: 14.5, delay: 8.5, drift: -45 },
  { left: 79, size: 6, duration: 11, delay: 4.4, drift: 75 },
  { left: 86, size: 4, duration: 13.5, delay: 9.6, drift: -60 },
  { left: 93, size: 5, duration: 12, delay: 1.6, drift: 55 },
  { left: 97, size: 3, duration: 15, delay: 5.5, drift: -35 },
];

export default function Hero() {
  return (
    <section id="home" className="hero">
      {/* 漂浮火星 */}
      <div className="ember-particles" aria-hidden="true">
        {particles.map((p, i) => (
          <span
            key={i}
            className="ember-particle"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              ["--drift" as string]: `${p.drift}px`,
            }}
          />
        ))}
      </div>

      <h1 className="dream-title">绛洢 Jin_</h1>
      <p className="subtitle">
        <span className="quote">「于尘世灰烬中，欢愉是唯一不灭的星火。」</span>
        <span className="tagline">混沌养成系 VUP · SpRing 所属</span>
      </p>

      <div className="hero-actions">
        <a
          href={BILIBILI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="dream-btn"
        >
          <i className="fab fa-bilibili"></i> B站主页 · 点燃星火
        </a>
        <a href={DOUYIN_URL} className="dream-btn ghost">
          <i className="fab fa-tiktok"></i> 抖音
        </a>
      </div>

      {/* 左下角社交按钮 */}
      <div className="social-float-left">
        <a
          href={DOUYIN_URL}
          className="social-float-btn douyin"
          title="抖音"
        >
          <i className="fab fa-tiktok"></i>
        </a>
        <a
          href={BILIBILI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="social-float-btn bilibili"
          title="B站"
        >
          <i className="fab fa-bilibili"></i>
        </a>
      </div>
    </section>
  );
}
