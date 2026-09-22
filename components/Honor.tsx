"use client";

const honorData = [
  { number: "1,771", label: "位星火同行者", desc: "B站粉丝，与绛洢一同燃烧" },
  { number: "6,101", label: "次欢愉的点亮", desc: "每一赞都是不灭的星火" },
  { number: "23", label: "个烬火碎片", desc: "投稿作品持续更新中" },
  { number: "SpRing", label: "所属社团", desc: "混沌养成系 · 开发属性更多可能" },
];

export default function Honor() {
  return (
    <section id="honor" className="honor-section">
      <div className="honor-container">
        <h2 className="honor-title">烬火印记</h2>
        <p className="honor-subtitle">
          于尘世灰烬中，每一簇星火都是与你共处的证明
        </p>

        <div className="honor-grid">
          {honorData.map((item) => (
            <div key={item.label} className="honor-card">
              <div className="honor-number">{item.number}</div>
              <div className="honor-label">{item.label}</div>
              <div className="honor-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
