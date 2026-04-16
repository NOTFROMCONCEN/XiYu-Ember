/**
 * 现代化图标系统
 * @author Huameitang
 * 这个模块提供统一的图标管理系统
 * 支持SVG图标、Font Awesome图标和自定义图标
 * 遵循SOLID原则，提供可扩展的图标解决方案
 */

/**
 * 图标配置常量
 * 定义网站中使用的所有图标
 * 支持多种图标类型和主题
 */
const ICON_CONFIG = {
    // 导航图标
    navigation: {
        home: { type: 'fa', icon: 'fas fa-home', alt: '首页' },
        profile: { type: 'fa', icon: 'fas fa-user-circle', alt: '馆主档案' },
        fragments: { type: 'fa', icon: 'fas fa-film', alt: '栖屿碎片' },
        booking: { type: 'fa', icon: 'fas fa-calendar-check', alt: '派对预约' },
        marshmallow: { type: 'fa', icon: 'fas fa-candy-cane', alt: '棉花糖' },
        archive: { type: 'fa', icon: 'fas fa-archive', alt: '档案馆' },
        about: { type: 'fa', icon: 'fas fa-info-circle', alt: '关于' }
    },
    
    // 功能卡片图标
    cards: {
        profile: { type: 'svg', icon: 'user-profile', alt: '馆主档案' },
        fragments: { type: 'svg', icon: 'video-fragments', alt: '栖屿碎片' },
        booking: { type: 'svg', icon: 'party-booking', alt: '派对预约' },
        marshmallow: { type: 'svg', icon: 'marshmallow', alt: '棉花糖' }
    },
    
    // 社交媒体图标
    social: {
        instagram: { type: 'fa', icon: 'fab fa-instagram', alt: 'Instagram' },
        wechat: { type: 'fa', icon: 'fab fa-weixin', alt: '微信' },
        qq: { type: 'fa', icon: 'fab fa-qq', alt: 'QQ' },
        phone: { type: 'fa', icon: 'fas fa-phone', alt: '电话' },
        email: { type: 'fa', icon: 'fas fa-envelope', alt: '邮箱' },
        discord: { type: 'fa', icon: 'fab fa-discord', alt: 'Discord' },
        bilibili: { type: 'svg', icon: 'bilibili', alt: 'B站' }
    },
    
    // 派对活动图标
    party: {
        music: { type: 'svg', icon: 'music-note', alt: '音乐' },
        cocktail: { type: 'svg', icon: 'cocktail-glass', alt: '鸡尾酒' },
        gaming: { type: 'svg', icon: 'game-controller', alt: '游戏' },
        microphone: { type: 'svg', icon: 'microphone', alt: '麦克风' },
        camera: { type: 'svg', icon: 'camera', alt: '相机' },
        gift: { type: 'svg', icon: 'gift-box', alt: '礼物' },
        heart: { type: 'svg', icon: 'heart', alt: '爱心' },
        star: { type: 'svg', icon: 'star', alt: '星星' },
        fire: { type: 'svg', icon: 'fire', alt: '火焰' },
        candy: { type: 'svg', icon: 'candy', alt: '糖果' },
        dance: { type: 'svg', icon: 'dance', alt: '舞蹈' },
        karaoke: { type: 'svg', icon: 'karaoke', alt: 'K歌' }
    },
    
    // 表单图标
    form: {
        user: { type: 'fa', icon: 'fas fa-user', alt: '用户' },
        contact: { type: 'fa', icon: 'fas fa-address-book', alt: '联系方式' },
        calendar: { type: 'fa', icon: 'fas fa-calendar-alt', alt: '日期' },
        type: { type: 'fa', icon: 'fas fa-tags', alt: '类型' },
        message: { type: 'fa', icon: 'fas fa-comment-dots', alt: '消息' },
        submit: { type: 'fa', icon: 'fas fa-paper-plane', alt: '提交' }
    },
    
    // 状态图标
    status: {
        loading: { type: 'fa', icon: 'fas fa-spinner fa-spin', alt: '加载中' },
        success: { type: 'fa', icon: 'fas fa-check-circle', alt: '成功' },
        error: { type: 'fa', icon: 'fas fa-exclamation-triangle', alt: '错误' },
        warning: { type: 'fa', icon: 'fas fa-exclamation-circle', alt: '警告' },
        info: { type: 'fa', icon: 'fas fa-info-circle', alt: '信息' }
    }
};

/**
 * SVG图标库
 * 定义自定义SVG图标
 * 采用现代化设计风格，支持主题色彩
 */
const SVG_ICONS = {
    'user-profile': `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1" opacity="0.3"/>
        </svg>
    `,
    
    'video-fragments': `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
            <polygon points="10,8 16,12 10,16" fill="currentColor"/>
            <circle cx="6" cy="6" r="1" fill="currentColor" opacity="0.6"/>
            <circle cx="18" cy="6" r="1" fill="currentColor" opacity="0.6"/>
        </svg>
    `,
    
    'party-booking': `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="15" rx="2" stroke="currentColor" stroke-width="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
            <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="7" r="1" fill="currentColor"/>
            <path d="m9 1 0 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="m15 1 0 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    
    'marshmallow': `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.5 2 6 4.5 6 8c0 2 1 3.5 2.5 4.5L7 22h10l-1.5-9.5C17 11.5 18 10 18 8c0-3.5-2.5-6-6-6z" stroke="currentColor" stroke-width="2" fill="currentColor" opacity="0.1"/>
            <circle cx="12" cy="8" r="3" stroke="currentColor" stroke-width="2" fill="currentColor" opacity="0.3"/>
            <path d="M9 15h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    
    'music-note': `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
            <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
        </svg>
    `,
    
    'cocktail-glass': `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 7h14l-4 6v4h-6v-4L5 7z" stroke="currentColor" stroke-width="2" fill="currentColor" opacity="0.1"/>
            <path d="M5 7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 17v4" stroke="currentColor" stroke-width="2"/>
            <path d="M9 21h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    
    'game-controller': `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 10h4m-2-2v4m8-1h.01M17 12h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="2" y="6" width="20" height="12" rx="6" stroke="currentColor" stroke-width="2"/>
        </svg>
    `,
    
    'bilibili': `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="8" width="18" height="10" rx="2" stroke="currentColor" stroke-width="2" fill="currentColor" opacity="0.1"/>
            <circle cx="8" cy="13" r="1" fill="currentColor"/>
            <circle cx="16" cy="13" r="1" fill="currentColor"/>
            <path d="M7 6l2-2M17 6l-2-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `
};

/**
 * 图标渲染器类
 * 负责渲染不同类型的图标
 * 支持主题切换和动态样式
 */
class IconRenderer {
    /**
     * 构造函数
     * 初始化图标渲染器
     * @author Huameitang
     */
    constructor() {
        this.theme = 'default';
        this.cache = new Map();
    }
    
    /**
     * 渲染图标
     * 根据图标配置生成HTML元素
     * 支持缓存机制提升性能
     * @param {string} category - 图标分类
     * @param {string} name - 图标名称
     * @param {Object} options - 渲染选项
     * @returns {HTMLElement} 图标元素
     * @author Huameitang
     */
    render(category, name, options = {}) {
        const cacheKey = `${category}-${name}-${JSON.stringify(options)}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey).cloneNode(true);
        }
        
        const iconConfig = ICON_CONFIG[category]?.[name];
        if (!iconConfig) {
            console.warn(`图标未找到: ${category}.${name}`);
            return this.createFallbackIcon();
        }
        
        let element;
        
        if (iconConfig.type === 'fa') {
            element = this.renderFontAwesome(iconConfig, options);
        } else if (iconConfig.type === 'svg') {
            element = this.renderSVG(iconConfig, options);
        }
        
        this.cache.set(cacheKey, element.cloneNode(true));
        return element;
    }
    
    /**
     * 渲染Font Awesome图标
     * 创建Font Awesome图标元素
     * @param {Object} config - 图标配置
     * @param {Object} options - 渲染选项
     * @returns {HTMLElement} 图标元素
     * @author Huameitang
     */
    renderFontAwesome(config, options) {
        const i = document.createElement('i');
        i.className = config.icon;
        i.setAttribute('aria-label', config.alt);
        
        if (options.size) {
            i.style.fontSize = options.size;
        }
        
        if (options.color) {
            i.style.color = options.color;
        }
        
        if (options.className) {
            i.classList.add(...options.className.split(' '));
        }
        
        return i;
    }
    
    /**
     * 渲染SVG图标
     * 创建SVG图标元素
     * @param {Object} config - 图标配置
     * @param {Object} options - 渲染选项
     * @returns {HTMLElement} 图标元素
     * @author Huameitang
     */
    renderSVG(config, options) {
        const wrapper = document.createElement('div');
        wrapper.className = 'svg-icon';
        wrapper.setAttribute('aria-label', config.alt);
        
        const svgContent = SVG_ICONS[config.icon];
        if (svgContent) {
            wrapper.innerHTML = svgContent;
            const svg = wrapper.querySelector('svg');
            
            if (options.size) {
                svg.style.width = options.size;
                svg.style.height = options.size;
            }
            
            if (options.color) {
                svg.style.color = options.color;
            }
        }
        
        if (options.className) {
            wrapper.classList.add(...options.className.split(' '));
        }
        
        return wrapper;
    }
    
    /**
     * 创建备用图标
     * 当指定图标不存在时显示的默认图标
     * @returns {HTMLElement} 备用图标元素
     * @author Huameitang
     */
    createFallbackIcon() {
        const i = document.createElement('i');
        i.className = 'fas fa-question-circle';
        i.style.opacity = '0.5';
        i.setAttribute('aria-label', '未知图标');
        return i;
    }
    
    /**
     * 设置主题
     * 切换图标主题样式
     * @param {string} theme - 主题名称
     * @author Huameitang
     */
    setTheme(theme) {
        this.theme = theme;
        this.cache.clear(); // 清除缓存以应用新主题
    }
    
    /**
     * 清除缓存
     * 释放内存，提升性能
     * @author Huameitang
     */
    clearCache() {
        this.cache.clear();
    }
}

// 创建全局图标渲染器实例
const iconRenderer = new IconRenderer();

/**
 * 便捷函数：渲染图标
 * 提供简单的图标渲染接口
 * @param {string} category - 图标分类
 * @param {string} name - 图标名称
 * @param {Object} options - 渲染选项
 * @returns {HTMLElement} 图标元素
 * @author Huameitang
 */
function renderIcon(category, name, options = {}) {
    return iconRenderer.render(category, name, options);
}

/**
 * 便捷函数：批量替换图标
 * 根据选择器批量替换页面中的图标
 * @param {string} selector - CSS选择器
 * @param {string} category - 图标分类
 * @param {string} name - 图标名称
 * @param {Object} options - 渲染选项
 * @author Huameitang
 */
function replaceIcons(selector, category, name, options = {}) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        const icon = renderIcon(category, name, options);
        element.innerHTML = '';
        element.appendChild(icon);
    });
}

// 导出模块
export {
    ICON_CONFIG,
    SVG_ICONS,
    IconRenderer,
    iconRenderer,
    renderIcon,
    replaceIcons
};