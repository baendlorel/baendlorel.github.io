<script lang="ts">
  import { onMount } from 'svelte';
  import { loadRepoData } from '@/store/repo.js';
  import { themeStore, themes } from '@/store/theme.js';
  import { languageStore, t, type Language } from '@/store/i18n.js';
  import Header from '@/lib/Header.svelte';
  import PackageGrid from '@/lib/PackageGrid.svelte';
  import Footer from '@/lib/Footer.svelte';
  import SettingsDemo from '@/lib/SettingsDemo.svelte';

  let currentTheme: string;
  let currentLang: Language;

  // 订阅主题变化
  themeStore.subscribe((theme) => {
    currentTheme = theme;
    if (typeof document !== 'undefined') {
      // 应用 CSS 变量
      const root = document.documentElement;
      const themeVars = themes[theme];
      Object.entries(themeVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  });

  // 订阅语言变化
  languageStore.subscribe((lang) => {
    currentLang = lang;
  });

  onMount(() => {
    // 初始化主题
    themeStore.init();
    // 加载数据
    loadRepoData();
  });
</script>

<div class="container">
  <Header />

  <main class="main">
    <section class="intro">
      <h2>{t('welcome', currentLang)}</h2>
      <p>
        {t('intro', currentLang)}
      </p>
    </section>

    <!-- 临时添加设置演示，测试完成后可以移除 -->
    <SettingsDemo />

    <PackageGrid />
  </main>

  <Footer />
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family:
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif;
    background: var(--background);
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
  }

  .container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main {
    flex: 1;
    padding: 0 1rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .intro {
    text-align: center;
    padding: 3rem 0;
    max-width: 800px;
    margin: 0 auto;
  }

  .intro h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: var(--gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .intro p {
    font-size: 1.2rem;
    color: var(--text-secondary);
    line-height: 1.8;
  }

  @media (max-width: 768px) {
    .intro h2 {
      font-size: 2rem;
    }

    .intro p {
      font-size: 1.1rem;
    }
  }
</style>
