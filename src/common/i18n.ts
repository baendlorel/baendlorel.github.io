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
  darkMode: '暗色模式',
  lightMode: '亮色模式',

  builtWith: '使用',
  and: '和',
  madeWithLove: '用 ❤️ 制作',

  errorLoading: '加载数据出错',
  tryAgain: '重试',

  // Contact Dialog
  collaborateWithMe: '与我合作',
  collaborate: '开发服务 / 打赏',
  customDevelopment: '定制开发服务',
  developmentDescription:
    '我提供高质量的前端开发、Node.js全栈应用开发和技术咨询服务。如果您有项目、小工具的开发需求，欢迎联系我！',
  frontendDev: '前端开发（Vue、Svelte、React、Vanilla、Yuka.js）',
  fullstackDev: '全栈方案（Node.js）',
  techConsulting: '技术交流学习、咨询（TypeScript/JavaScript）',
  supportMyWork: '支持我的工作',
  supportDescription:
    '如果您觉得我的开源项目对您有帮助，欢迎使用我的NPM包或打赏支持！您的支持是我继续创作的动力 🌟',
  getInTouch: '联系方式',
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
  darkMode: 'Dark Mode',
  lightMode: 'Light Mode',

  builtWith: 'Built with',
  and: 'and',
  madeWithLove: 'Made with ❤️',

  errorLoading: 'Error loading data',
  tryAgain: 'Try Again',

  // Contact Dialog
  collaborateWithMe: 'Collaborate with Me',
  collaborate: 'Development Services / Donate',
  customDevelopment: 'Custom Development Services',
  developmentDescription:
    'I provide high-quality frontend development, Node.js full-stack application development, and technical consulting services. If you have any project or tool development needs, feel free to contact me!',
  frontendDev: 'Frontend Development (Vue, Svelte, React, Vanilla, Yuka.js)',
  fullstackDev: 'Full-stack Solutions (Node.js)',
  techConsulting: 'Technical Exchange & Consulting (TypeScript/JavaScript)',
  supportMyWork: 'Support My Work',
  supportDescription:
    'If you find my open-source projects helpful, please use my NPM packages or consider donating! Your support motivates me to keep creating 🌟',
  getInTouch: 'Get in Touch',
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
    t: (lorem) => dict[lorem],
    lang,
  };
};

const { toggle, t, lang } = createLanguageStore();
export { toggle, t, lang };
