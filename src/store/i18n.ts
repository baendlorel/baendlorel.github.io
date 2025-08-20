import { writable } from 'svelte/store';
import { load, save } from './persistance.js';

export type Language = 'en' | 'zh';

// 多语言文本定义
export const translations = {
  en: {
    // 导航和通用
    welcome: '🚀 Welcome to My Package Collection',
    intro:
      "Here you'll find all my open-source packages. Each one is crafted with care and designed to make your development experience better! (◕‿◕)",
    repositories: 'Repositories',
    npmPackages: 'NPM Packages',
    featuredProjects: 'Featured Projects',
    allProjects: 'All Projects',

    // 项目卡片
    stars: 'Stars',
    forks: 'Forks',
    downloads: 'Downloads',
    version: 'Version',
    updated: 'Updated',
    viewOnGitHub: 'View on GitHub',
    viewOnNPM: 'View on NPM',

    // 搜索和筛选
    searchPlaceholder: 'Search packages...',
    noResults: 'No packages found matching your search.',
    loading: 'Loading packages...',

    // 主题和语言切换
    toggleTheme: 'Toggle Theme',
    toggleLanguage: 'Switch Language',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',

    // 页脚
    builtWith: 'Built with',
    and: 'and',
    madeWithLove: 'Made with ❤️ by',

    // 错误信息
    errorLoading: 'Error loading data',
    tryAgain: 'Try Again',
  },
  zh: {
    // 导航和通用
    welcome: '🚀 欢迎来到我的包集合',
    intro: '这里展示了我所有的开源包。每一个都经过精心制作，旨在让你的开发体验更美好！(◕‿◕)',
    repositories: '仓库数',
    npmPackages: 'NPM 包',
    featuredProjects: '特色项目',
    allProjects: '所有项目',

    // 项目卡片
    stars: '星标',
    forks: '分叉',
    downloads: '下载量',
    version: '版本',
    updated: '更新时间',
    viewOnGitHub: '在 GitHub 查看',
    viewOnNPM: '在 NPM 查看',

    // 搜索和筛选
    searchPlaceholder: '搜索包...',
    noResults: '没有找到匹配的包。',
    loading: '加载中...',

    // 主题和语言切换
    toggleTheme: '切换主题',
    toggleLanguage: '切换语言',
    darkMode: '暗色模式',
    lightMode: '亮色模式',

    // 页脚
    builtWith: '使用',
    and: '和',
    madeWithLove: '用 ❤️ 制作，作者',

    // 错误信息
    errorLoading: '加载数据出错',
    tryAgain: '重试',
  },
};

// 创建语言 store
const createLanguageStore = () => {
  const savedLang = load<Language>('language') || 'en';
  const { subscribe, set } = writable<Language>(savedLang);

  return {
    subscribe,
    set: (lang: Language) => {
      set(lang);
      save('language', lang);
    },
    toggle: () => {
      const current = load<Language>('language') || 'en';
      const newLang = current === 'en' ? 'zh' : 'en';
      set(newLang);
      save('language', newLang);
    },
  };
};

export const languageStore = createLanguageStore();

// 翻译函数
export const t = (key: string, lang: Language): string => {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
};
