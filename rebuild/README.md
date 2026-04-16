# rebuild

这是一个简化重构版目录，目标是替代旧工程中复杂的组件动态加载和多重性能脚本。

## 结构

- index.html: 首页
- pages/about.html: 关于页
- pages/fragments.html: 栖屿碎片页
- assets/css/style.css: 全站主样式
- assets/js/main.js: 轻量交互（移动菜单）

## 设计原则

1. 首页 + 其他页面，清晰直连，不做运行时拼装。
2. 一份主样式，降低维护成本。
3. 无构建步骤，直接静态可运行。

## 使用

直接在浏览器打开 index.html，或通过任意静态服务器运行该目录。
