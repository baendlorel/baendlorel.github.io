import persis from '@/persistance/index.js';

const KEY = 'language';

const zh = {
  welcome: '🚀 欢迎来到Tsumu Cabin!',
  bio: '创造美好事物',
  intro: '这里展示了我所有的开源程序。每一个都经过精心制作，旨在让你的开发体验更美好！(◕‿◕)',
  repositories: '仓库数',
  npmPackages: 'NPM包',
  featuredProjects: '特色项目',
  otherProjects: '其他项目',
  allProjects: '所有项目',

  updatedAt: '更新于',
  stars: '星标',
  forks: '分叉',
  downloads: '下载量',
  version: '版本',
  updated: '更新时间',
  viewOnGitHub: '前往仓库',
  viewOnNPM: '前往NPM',
  repoNameCopied: '复制成功',

  searchPlaceholder: '🔍搜索包...',
  noResults: '没有找到匹配的包。',
  loading: '加载中...',

  toggleTheme: '切换主题',
  toggleLanguage: '切换语言',
  darkMode: 'Dark',
  lightMode: 'Light',

  builtWith: '使用',
  and: '和',
  madeWithLove: '用 ❤️ 制作',

  errorLoading: '加载数据出错',
  tryAgain: '重试',

  // Contact Dialog
  collaborateWithMe: '开发服务 / 打赏支持',
  collaborate: '开发服务 / 打赏',
  customDevelopment: '定制开发服务',
  developmentDescription: '提供高质量开发服务，如果您有需求，欢迎联系我！',
  frontendDev: '前端开发（Vue、Svelte、React、Vanilla、Yuka.js...）',
  fullstackDev: '全栈方案（Node.js），跨平台应用（Electron、Tauri...）',
  techConsulting: '技术交流学习、咨询（TypeScript/JavaScript）',
  supportMyWork: '支持我的作品 / 打赏',
  supportDescription:
    '如果您觉得我的开源项目对您有帮助，欢迎使用我的NPM包或打赏支持！您的支持是我继续创作的动力 🌟',
  getInTouch: '联系',
  mailMeNow: '点击此处给我发邮件',
  responseTime: '通常48小时内回复',
};

const en = {
  welcome: '🚀 Welcome to Tsumu Cabin!',
  bio: 'Creating awesome stuff',
  intro:
    'Here you will find all my open-source packages. Each one is crafted with care and designed to make your development experience better! (◕‿◕)',
  repositories: 'Repositories',
  npmPackages: 'NPM Packages',
  featuredProjects: 'Featured Projects',
  otherProjects: 'Others',
  allProjects: 'All Projects',

  updatedAt: 'Updated',
  stars: 'Stars',
  forks: 'Forks',
  downloads: 'Downloads',
  version: 'Version',
  updated: 'Updated',
  viewOnGitHub: 'GitHub',
  viewOnNPM: 'NPM',
  repoNameCopied: 'Copied!',

  searchPlaceholder: '🔍Search packages...',
  noResults: 'No packages found matching your search.',
  loading: 'Loading packages...',

  toggleTheme: 'Toggle Theme',
  toggleLanguage: 'Switch Language',
  darkMode: 'Dark',
  lightMode: 'Light',

  builtWith: 'Built with',
  and: 'and',
  madeWithLove: 'Made with ❤️',

  errorLoading: 'Error loading data',
  tryAgain: 'Try Again',

  // Contact Dialog
  collaborateWithMe: 'Development Services / Donate',
  collaborate: 'Development Services / Donate',
  customDevelopment: 'Custom Development Services',
  developmentDescription: 'If you have needs, feel free to contact me!',
  frontendDev: 'Frontend Development (Vue, Svelte, React, Vanilla, Yuka.js...)',
  fullstackDev: 'Full-stack Solutions (Node.js), cross-platform apps (Electron, Tauri...)',
  techConsulting: 'Technical Exchange & Consulting (TypeScript/JavaScript)',
  supportMyWork: 'Support My Work / Donate',
  supportDescription:
    'If you find my open-source projects helpful, please use my NPM packages or consider donating! Your support motivates me to keep creating 🌟',
  getInTouch: 'Get in Touch',
  mailMeNow: 'Click here to Mail Me Now',
  responseTime: 'Usually respond within 48 hours',
} satisfies typeof zh;

const createLanguageStore = () => {
  const lang = persis.load<Language>(KEY) ?? 'en';

  const dict = lang === 'en' ? en : zh;

  return {
    toggle: () => {
      const newLang = lang === 'en' ? 'zh' : 'en';
      persis.save(KEY, newLang);
      window.location.reload();
    },
    t: (lorem: keyof typeof zh) => dict[lorem],
    lang,
  };
};

const { toggle, t, lang } = createLanguageStore();
export { toggle, t, lang };
