<script lang="ts">
  import { themeStore, toggle } from '@/store/theme.js';
  import { t, lang } from '@/common/i18n.js';

  $: currentTheme = $themeStore;

  function toggleTheme() {
    toggle();
  }
</script>

<div class="controls">
  <button
    class="control-btn theme-btn"
    on:click={toggleTheme}
    title={t('toggleTheme')}
    aria-label={t('toggleTheme')}
  >
    {#if currentTheme === 'dark'}
      <i class="fas fa-sun"></i>
      <span>{t('lightMode')}</span>
    {:else}
      <i class="fas fa-moon"></i>
      <span>{t('darkMode')}</span>
    {/if}
  </button>

  <button
    class="control-btn lang-btn"
    on:click={toggleLanguage}
    title={t('toggleLanguage')}
    aria-label={t('toggleLanguage')}
  >
    <i class="fas fa-language"></i>
    <span>{lang === 'en' ? '中文' : 'English'}</span>
  </button>
</div>

<style>
  .controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .control-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--surface-light);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-secondary);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .control-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-1px);
  }

  .control-btn i {
    font-size: 1rem;
  }

  .control-btn span {
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .control-btn span {
      display: none;
    }

    .control-btn {
      padding: 0.5rem;
      min-width: 40px;
      justify-content: center;
    }
  }
</style>
