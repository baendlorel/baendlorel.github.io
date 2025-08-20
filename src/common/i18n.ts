import persis from '@/persistance/index.js';

const KEY = 'language';

const zh = {
  welcome: '🚀 欢迎来到Tsumu Cabin!',
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
  collaborate: '合作',
  customDevelopment: '定制开发服务',
  developmentDescription:
    '我提供高质量的前端开发、全栈应用开发和技术咨询服务。如果您有项目需求，欢迎联系我！',
  frontendDev: '前端应用开发',
  fullstackDev: '全栈解决方案',
  techConsulting: '技术咨询',
  projectMaintenance: '项目维护',
  supportMyWork: '支持我的工作',
  supportDescription:
    '如果您觉得我的开源项目对您有帮助，欢迎打赏支持！您的支持是我继续创作的动力 🌟',
  qrCodePlaceholder: '扫码打赏',
  qrCodeNote: '请添加您的二维码图片',
  getInTouch: '联系方式',
  responseTime: '通常24小时内回复',
};

const en = {
  welcome: '🚀 Welcome to Tsumu Cabin!',
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
  collaborate: 'Collaborate',
  customDevelopment: 'Custom Development Services',
  developmentDescription:
    'I provide high-quality frontend development, full-stack solutions, and technical consulting services. Feel free to contact me for your project needs!',
  frontendDev: 'Frontend Development',
  fullstackDev: 'Full-stack Solutions',
  techConsulting: 'Technical Consulting',
  projectMaintenance: 'Project Maintenance',
  supportMyWork: 'Support My Work',
  supportDescription:
    "If you find my open-source projects helpful, I'd appreciate your support! Your contribution motivates me to keep creating 🌟",
  qrCodePlaceholder: 'Scan to Donate',
  qrCodeNote: 'Please add your QR code image',
  getInTouch: 'Get in Touch',
  responseTime: 'Usually respond within 24 hours',
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
