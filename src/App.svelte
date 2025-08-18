<script lang="ts">
  import { loadRepoData } from '@/store/repo.js';
  import Header from '@/lib/Header.svelte';
  import PackageGrid from '@/lib/PackageGrid.svelte';
  import Footer from '@/lib/Footer.svelte';

  loadRepoData();
</script>

<div class="container">
  <Header />

  <main class="main">
    <section class="intro">
      <h2>🚀 Welcome to My Package Collection</h2>
      <p>
        Here you'll find all my open-source NPM packages. Each one is crafted with care and designed
        to make your development experience better! (◕‿◕)
      </p>
    </section>

    <PackageGrid />
  </main>

  <Footer />
</div>

<style>
  :global(:root) {
    --primary-color: #6366f1;
    --primary-dark: #4f46e5;
    --secondary-color: #ec4899;
    --accent-color: #06d6a0;
    --background: #0f172a;
    --surface: #1e293b;
    --surface-light: #334155;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #94a3b8;
    --border: #475569;
    --shadow: rgba(0, 0, 0, 0.3);
    --gradient: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  }

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
