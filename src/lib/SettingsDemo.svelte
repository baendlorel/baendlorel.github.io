<script lang="ts">
  import { themeStore } from '@/store/theme.js';
  import { languageStore, t } from '@/store/i18n.js';

  let currentTheme: Theme;
  let currentLang: Language;

  themeStore.subscribe((theme) => {
    currentTheme = theme;
  });

  languageStore.subscribe((lang) => {
    currentLang = lang;
  });

  function setTheme(theme: Theme) {
    themeStore.set(theme);
  }

  function setLanguage(lang: Language) {
    languageStore.set(lang);
  }
</script>

<div class="settings-demo">
  <h3>🎨 {t('toggleTheme', currentLang)}</h3>
  <div class="setting-group">
    <button
      class="setting-btn"
      class:active={currentTheme === 'dark'}
      on:click={() => setTheme('dark')}
    >
      <i class="fas fa-moon"></i>
      {t('darkMode', currentLang)}
    </button>
    <button
      class="setting-btn"
      class:active={currentTheme === 'light'}
      on:click={() => setTheme('light')}
    >
      <i class="fas fa-sun"></i>
      {t('lightMode', currentLang)}
    </button>
  </div>

  <h3>🌍 {t('toggleLanguage', currentLang)}</h3>
  <div class="setting-group">
    <button
      class="setting-btn"
      class:active={currentLang === 'en'}
      on:click={() => setLanguage('en')}
    >
      <i class="fas fa-flag-usa"></i>
      English
    </button>
    <button
      class="setting-btn"
      class:active={currentLang === 'zh'}
      on:click={() => setLanguage('zh')}
    >
      <i class="fas fa-flag"></i>
      中文
    </button>
  </div>

  <div class="info">
    <p>💾 Settings are automatically saved to localStorage</p>
    <p>🔄 Theme and language persist between sessions</p>
  </div>
</div>

<style>
  .settings-demo {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem 0;
    max-width: 600px;
  }

  .settings-demo h3 {
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .setting-group {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .setting-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--surface-light);
    border: 2px solid var(--border);
    border-radius: 8px;
    color: var(--text-secondary);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    justify-content: center;
  }

  .setting-btn:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  .setting-btn.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }

  .setting-btn i {
    font-size: 1.1rem;
  }

  .info {
    background: var(--surface-light);
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
  }

  .info p {
    color: var(--text-muted);
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .setting-group {
      flex-direction: column;
    }
  }
</style>
