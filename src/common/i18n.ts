import persis from '@/persistance/index.js';

const KEY = 'language';

const translations = {
  en: {
    welcome: '🚀 Welcome to My Package Collection',
    intro:
      "Here you'll find all my open-source packages. Each one is crafted with care and designed to make your development experience better! (◕‿◕)",
    repositories: 'Repositories',
    npmPackages: 'NPM Packages',
    featuredProjects: 'Featured Projects',
    otherProjects: 'Others',
    allProjects: 'All Projects',

    stars: 'Stars',
    forks: 'Forks',
    downloads: 'Downloads',
    version: 'Version',
    updated: 'Updated',
    viewOnGitHub: 'View on GitHub',
    viewOnNPM: 'View on NPM',

    searchPlaceholder: 'Search packages...',
    noResults: 'No packages found matching your search.',
    loading: 'Loading packages...',

    toggleTheme: 'Toggle Theme',
    toggleLanguage: 'Switch Language',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',

    builtWith: 'Built with',
    and: 'and',
    madeWithLove: 'Made with ❤️ by',

    errorLoading: 'Error loading data',
    tryAgain: 'Try Again',
  },
  zh: {
    welcome: '🚀 欢迎来到我的包集合',
    intro: '这里展示了我所有的开源包。每一个都经过精心制作，旨在让你的开发体验更美好！(◕‿◕)',
    repositories: '仓库数',
    npmPackages: 'NPM 包',
    featuredProjects: '特色项目',
    otherProjects: '其他项目',
    allProjects: '所有项目',

    stars: '星标',
    forks: '分叉',
    downloads: '下载量',
    version: '版本',
    updated: '更新时间',
    viewOnGitHub: '前往仓库',
    viewOnNPM: '前往NPM',

    searchPlaceholder: '搜索包...',
    noResults: '没有找到匹配的包。',
    loading: '加载中...',

    toggleTheme: '切换主题',
    toggleLanguage: '切换语言',
    darkMode: '暗色模式',
    lightMode: '亮色模式',

    builtWith: '使用',
    and: '和',
    madeWithLove: '用 ❤️ 制作，作者',

    errorLoading: '加载数据出错',
    tryAgain: '重试',
  },
};

const createLanguageStore = () => {
  const lang = persis.load<Language>(KEY) ?? 'en';

  return {
    toggle: () => {
      const newLang = lang === 'en' ? 'zh' : 'en';
      persis.save(KEY, newLang);
      window.location.reload();
    },
    t: (lorem) => translations[lang][lorem],
    lang,
  };
};

const { toggle, t, lang } = createLanguageStore();
export { toggle, t, lang };
