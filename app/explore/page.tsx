"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BILIBILI_URL = "https://space.bilibili.com/87874065";

const exploreItems = [
  {
    icon: "fa-user",
    title: "绛洢档案",
    desc: "认识「绛洢Jin_」—— SpRing 所属的混沌养成系虚拟主播。于尘世灰烬中诞生，相信欢愉是唯一不灭的星火，会永远努力开发属性的更多可能。",
    features: [
      "混沌养成系的成长记录",
      "SpRing 社团所属",
      "「开发属性的更多可能」的持续挑战",
      "一个会永远努力的 Jin",
    ],
  },
  {
    icon: "fa-film",
    title: "烬火碎片",
    desc: "散落在 B 站的珍贵影像，捕捉绛洢的每一个欢愉瞬间。直播回放、精彩切片与歌切，每一片碎片都是不灭星火的证明。",
    features: [
      "直播回放与精彩切片",
      "歌切与名场面集锦",
      "混沌属性的名场面现场收藏",
      "新人快来补课指南",
    ],
  },
  {
    icon: "fa-calendar-alt",
    title: "星火之约",
    desc: "锁定绛洢的直播日程，预约开播提醒，不错过任何一场灰烬中的欢愉聚会。关注 B 站账号即可接收动态推送。",
    features: [
      "B站直播预约提醒",
      "动态更新实时推送",
      "粉丝群 1053630553 内通知",
      "重要纪念日活动预告",
    ],
  },
  {
    icon: "fa-candy-cane",
    title: "棉花糖",
    desc: "甜蜜的互动空间，在这里向绛洢分享你的想法和感受，与其他星火伙伴建立温暖的连接，一起在灰烬中取暖。",
    features: [
      "棉花糖投稿与读信",
      "粉丝群交流互动",
      "二创作品征集展示",
      "温暖的星火社区氛围",
    ],
  },
];

export default function ExplorePage() {
  return (
    <>
      <Header />
      <main className="explore-page">
        <div className="explore-container">
          <div className="explore-header">
            <h1 className="explore-title">走进绛洢</h1>
            <p className="explore-subtitle">
              从星火燃起的地方踏入，发现「绛洢Jin_」的完整世界。档案、影像、之约与棉花糖，都在这里等你。
            </p>
          </div>

          <div className="explore-sections">
            {exploreItems.map((item) => (
              <div key={item.title} className="explore-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h2 className="card-title">{item.title}</h2>
                </div>
                <div className="card-text">
                  <p>{item.desc}</p>
                  <ul className="feature-list">
                    {item.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="cta-section">
            <h2 className="cta-title">准备好点亮你的星火了吗？</h2>
            <p className="cta-text">于尘世灰烬中，欢愉是唯一不灭的星火 —— 立即前往 B 站关注绛洢Jin_</p>
            <a href={BILIBILI_URL} target="_blank" rel="noopener noreferrer" className="cta-btn">
              前往 B 站关注
            </a>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .explore-page {
          background-color: #0d0a08;
          color: #f2e9de;
          font-family: 'Noto Sans SC', sans-serif;
          min-height: 100vh;
          padding-top: 80px;
          position: relative;
        }
        .explore-container {
          max-width: 1200px;
          margin: 60px auto;
          padding: 0 20px;
        }
        .explore-header {
          text-align: center;
          margin-bottom: 80px;
        }
        .explore-title {
          font-family: 'Noto Serif SC', serif;
          font-size: 3.5em;
          font-weight: 700;
          letter-spacing: 0.08em;
          background: linear-gradient(115deg, #f5d78e 10%, #e8b64c 45%, #e8505b 90%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 24px rgba(192, 44, 58, 0.4));
          margin-bottom: 20px;
        }
        .explore-subtitle {
          font-family: 'Noto Sans SC', sans-serif;
          color: #bdaa97;
          font-size: 1.3em;
          max-width: 640px;
          margin: 0 auto;
          line-height: 1.7;
        }
        .explore-sections {
          display: grid;
          gap: 40px;
          margin-bottom: 80px;
        }
        .explore-card {
          background: rgba(34, 24, 16, 0.55);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(232, 182, 76, 0.14);
          border-radius: 25px;
          padding: 40px;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .explore-card:hover {
          transform: translateY(-5px);
          border-color: rgba(232, 182, 76, 0.35);
          box-shadow: 0 20px 44px rgba(0, 0, 0, 0.45), 0 0 28px rgba(192, 44, 58, 0.12);
        }
        .explore-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #e8b64c, #c02c3a, #ff7a45);
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }
        .card-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: linear-gradient(135deg, #e8b64c, #c02c3a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: #fff7ee;
          box-shadow: 0 10px 30px rgba(192, 44, 58, 0.35);
          flex-shrink: 0;
        }
        .card-title {
          font-family: 'Noto Serif SC', serif;
          font-size: 1.8em;
          font-weight: 700;
          color: #f5d78e;
          margin: 0;
        }
        .card-text {
          color: #bdaa97;
          line-height: 1.8;
          font-size: 1.1em;
        }
        .card-text p {
          margin-bottom: 16px;
        }
        .feature-list {
          list-style: none;
          padding: 0;
          margin: 20px 0 0;
        }
        .feature-list li {
          padding: 10px 0;
          padding-left: 30px;
          position: relative;
          color: #cdbba6;
          border-bottom: 1px solid rgba(232, 182, 76, 0.08);
        }
        .feature-list li:last-child {
          border-bottom: none;
        }
        .feature-list li::before {
          content: '\\f00c';
          font-family: 'Font Awesome 6 Free';
          font-weight: 900;
          position: absolute;
          left: 0;
          color: #e8b64c;
        }
        .cta-section {
          text-align: center;
          padding: 60px 40px;
          background: rgba(34, 24, 16, 0.4);
          border-radius: 25px;
          border: 1px solid rgba(232, 182, 76, 0.14);
          margin-top: 40px;
        }
        .cta-title {
          font-family: 'Noto Serif SC', serif;
          font-size: 2em;
          font-weight: 700;
          color: #f2e9de;
          margin-bottom: 20px;
        }
        .cta-text {
          color: #bdaa97;
          margin-bottom: 30px;
          font-size: 1.1em;
        }
        .cta-btn {
          display: inline-block;
          background: linear-gradient(135deg, #c02c3a, #9e2130);
          color: #fff7ee;
          padding: 16px 40px;
          border-radius: 50px;
          text-decoration: none;
          font-size: 1.1em;
          font-weight: 600;
          border: 1px solid rgba(255, 168, 150, 0.35);
          box-shadow: 0 10px 30px rgba(192, 44, 58, 0.4);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 44px rgba(232, 80, 91, 0.5);
        }
        @media (max-width: 768px) {
          .explore-title {
            font-size: 2.5em;
          }
          .explore-card {
            padding: 30px 20px;
          }
          .card-title {
            font-size: 1.5em;
          }
          .cta-section {
            padding: 40px 20px;
          }
        }
      `}</style>
    </>
  );
}
