<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '@/common/i18n.js';
  import { loadRepoData } from '@/store/repo.js';
  import { init as initTheme } from '@/store/theme.js';
  import Header from '@/lib/Header.svelte';
  import PackageGrid from '@/lib/package/PackageGrid.svelte';
  import Footer from '@/lib/Footer.svelte';

  onMount(() => {
    initTheme();
    loadRepoData();
  });
</script>

<div class="container">
  <Header />

  <main class="main">
    <section class="intro">
      <h2>{t('welcome')}</h2>
      <p>
        {t('intro')}
      </p>
    </section>

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
