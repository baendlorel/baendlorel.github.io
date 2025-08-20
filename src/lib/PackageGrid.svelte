<script lang="ts">
  import { onMount } from 'svelte';
  import { debounce } from '@/common/debounce.js';
  import { lang, t } from '@/common/i18n.js';
  import {
    loadRepoData,
    repoStore,
    featuredRepoStore,
    repoLoading,
    repoError,
  } from '@/store/repo.js';

  import PackageCard from './PackageCard.svelte';

  type RepoType = 'all' | 'npm' | 'featured' | 'other';

  // State
  $: repos = $repoStore;
  $: featuredRepos = $featuredRepoStore;
  let filteredRepos: RepoInfo[] = [];
  let searchQuery = '';
  let activeFilter: RepoType = 'featured'; // 默认值，会被 URL 参数覆盖

  function getRepoTypeFromURL(): RepoType {
    if (typeof window === 'undefined') {
      return 'featured';
    }

    const urlParams = new URLSearchParams(window.location.search);
    const repoType = urlParams.get('repoType') as RepoType;

    const validTypes: RepoType[] = ['all', 'npm', 'featured', 'other'];
    return validTypes.includes(repoType) ? repoType : 'featured';
  }

  // watch for URL changes
  function handlePopState() {
    activeFilter = getRepoTypeFromURL();
  }

  onMount(() => {
    activeFilter = getRepoTypeFromURL();

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  });

  // Reactive statements
  $: filterRepositories(repos, searchQuery, activeFilter);

  // Filter repositories based on search and filter type
  function filterRepositories(storedRepos: RepoInfo[], search: string, filter: RepoType) {
    if (storedRepos.length === 0) {
      filteredRepos = [];
      return;
    }
    let filtered = [...storedRepos];

    // Apply type filter
    if (filter === 'featured') {
      filtered = featuredRepos;
    } else if (filter !== 'all') {
      filtered = filtered.filter((repo) => {
        switch (filter) {
          case 'npm':
            return repo.is_npm_package;
          case 'other':
            return !repo.is_npm_package;
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(lower) ||
          repo.description?.toLowerCase().includes(lower) ||
          repo.topics?.some((topic) => topic.toLowerCase().includes(lower))
      );
    }

    filteredRepos = filtered;
  }

  // Handle search input
  function handleSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery = target.value;
  }

  // Handle filter change
  function handleFilter(filter: RepoType) {
    activeFilter = filter;
  }

  // Create debounced search handler
  const debouncedSearch = debounce(handleSearch, 300);
</script>

<section class="filters">
  <div class="filter-buttons">
    <button
      class="filter-btn"
      class:active={activeFilter === 'featured'}
      on:click={() => handleFilter('featured')}
    >
      {t('featuredProjects')}
    </button>
    <button
      class="filter-btn"
      class:active={activeFilter === 'npm'}
      on:click={() => handleFilter('npm')}
    >
      {t('npmPackages')}
    </button>
    <button
      class="filter-btn"
      class:active={activeFilter === 'other'}
      on:click={() => handleFilter('other')}
    >
      {t('otherProjects')}
    </button>
    <button
      class="filter-btn"
      class:active={activeFilter === 'all'}
      on:click={() => handleFilter('all')}
    >
      {t('allProjects')}
    </button>
  </div>
  <div class="search-box">
    <input
      type="text"
      placeholder={t('searchPlaceholder')}
      on:input={debouncedSearch}
      bind:value={searchQuery}
    />
  </div>
</section>

<section class="packages">
  {#if $repoLoading}
    <div class="loading">
      <div class="spinner"></div>
      <p>{t('loading')}</p>
    </div>
  {:else if $repoError}
    <div class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{t('errorLoading')}</p>
      <button on:click={loadRepoData} class="retry-btn">{t('tryAgain')}</button>
    </div>
  {:else if filteredRepos.length === 0}
    <div class="no-results">
      <i class="fas fa-search"></i>
      <p>{t('noResults')}</p>
    </div>
  {:else}
    <div class="packages-grid">
      {#each filteredRepos as repository (repository.id)}
        <PackageCard {repository} />
      {/each}
    </div>
  {/if}
</section>

<style>
  .filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    margin-bottom: 3rem;
    padding: 1.5rem;
    background: var(--surface);
    border-radius: 16px;
    border: 1px solid var(--border);
  }

  .filter-buttons {
    display: flex;
    gap: 0.5rem;
    background: var(--surface-light);
    padding: 0.5rem;
    border-radius: 12px;
  }

  .filter-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .filter-btn:hover {
    color: var(--text-primary);
    background: rgba(99, 102, 241, 0.1);
  }

  .filter-btn.active {
    background: var(--gradient);
    color: white;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .search-box {
    position: relative;
    flex: 1;
    max-width: 400px;
  }

  .search-box input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: var(--surface-light);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text-primary);
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .search-box input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .search-box input::placeholder {
    color: var(--text-muted);
  }

  .packages {
    margin-bottom: 3rem;
  }

  .loading,
  .error-message,
  .no-results {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-secondary);
  }

  .loading .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--surface-light);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .error-message i,
  .no-results i {
    font-size: 3rem;
    color: var(--text-muted);
    margin-bottom: 1rem;
    display: block;
  }

  .retry-btn {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: var(--gradient);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .retry-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .packages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
      gap: 1rem;
    }

    .filter-buttons {
      flex-wrap: wrap;
      justify-content: center;
    }

    .search-box {
      max-width: none;
      width: 100%;
    }

    .packages-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .filter-btn {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
    }
  }
</style>
