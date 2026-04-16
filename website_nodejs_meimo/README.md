# website_nodejs_meimo

## 快速开始

```bash
npm install
npm run dev
```

生产运行：

```bash
npm start
```

默认访问：`http://localhost:3000`

## 当前目录结构

- `server.js`: 服务器启动入口
- `src/`: 后端应用模块（配置、中间件、路由）
- `public/`: 前端页面、组件、样式、脚本与静态资源
- `docs/`: 项目文档
- `archive/`: 历史原型与备份文件（不参与运行）
- `resources/`: 设计素材与参考文件（不参与运行）

## 目录整理原则

- 运行时所需代码只放在 `server.js`、`src/`、`public/`
- 历史文件统一放入 `archive/`
- 文档统一放入 `docs/`
- 素材文件统一放入 `resources/`

## 说明

本次整理仅调整目录与工程结构，不修改页面视觉样式与访问路径。

## 已归档未使用脚本

以下脚本未被当前页面入口引用，已迁移到 `archive/js-unused/`：

- `animation-optimizer.js`
- `icon-system.js`
- `performance-manager.js`
- `performance-master.js`
