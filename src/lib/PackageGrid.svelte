<script lang="ts">
  import { onMount } from 'svelte';
  import PackageCard from './PackageCard.svelte';

  // Configuration
  const GITHUB_USERNAME = 'baendlorel';
  const GITHUB_API_BASE = 'https://api.github.com';

  // State
  let allRepositories: any[] = [];
  let filteredRepositories: any[] = [];
  let loading = true;
  let error = false;
  let searchQuery = '';
  let activeFilter = 'all';

  // Reactive statements
  $: filterRepositories(allRepositories, searchQuery, activeFilter);

  onMount(() => {
    loadRepositories();
  });

  // Load repositories from GitHub API
  async function loadRepositories() {
    try {
      loading = true;
      error = false;
      
      // Fetch repositories
      const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const repositories = await response.json();
      
      // Filter out forks and private repos, and enrich with package info
      allRepositories = await Promise.all(
        repositories
          .filter((repo: any) => !repo.fork && !repo.private)
          .map(async (repo: any) => await enrichRepositoryData(repo))
      );
      
      loading = false;
      
    } catch (err) {
      console.error('Error loading repositories:', err);
      error = true;
      loading = false;
    }
  }

  // Enrich repository data with additional information
  async function enrichRepositoryData(repo: any) {
    const enrichedRepo = {
      ...repo,
      isNpmPackage: false,
      packageInfo: null,
      npmStats: null
    };
    
    try {
      // Check if repository has package.json
      const packageResponse = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/contents/package.json`);
      
      if (packageResponse.ok) {
        const packageData = await packageResponse.json();
        const packageContent = JSON.parse(atob(packageData.content));
        
        enrichedRepo.isNpmPackage = true;
        enrichedRepo.packageInfo = packageContent;
        
        // Get NPM package stats if available
        try {
          const npmResponse = await fetch(`https://registry.npmjs.org/${packageContent.name}`);
          if (npmResponse.ok) {
            const npmData = await npmResponse.json();
            enrichedRepo.npmStats = {
              version: npmData['dist-tags']?.latest || 'unknown'
            };
          }
        } catch (npmError) {
          console.log(`NPM data not found for ${packageContent.name}`);
        }
      }
    } catch (err) {
      console.log(`Could not fetch package.json for ${repo.name}`);
    }
    
    return enrichedRepo;
  }

  // Filter repositories based on search and filter type
  function filterRepositories(repos: any[], search: string, filter: string) {
    if (!repos.length) {
      filteredRepositories = [];
      return;
    }

    let filtered = [...repos];

    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(repo => {
        switch (filter) {
          case 'npm':
            return repo.isNpmPackage;
          case 'library':
            return repo.topics?.includes('library');
          case 'tool':
            return repo.topics?.includes('tool');
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchLower) ||
        (repo.description && repo.description.toLowerCase().includes(searchLower)) ||
        (repo.topics && repo.topics.some((topic: string) => topic.toLowerCase().includes(searchLower)))
      );
    }

    filteredRepositories = filtered;
  }

  // Handle search input
  function handleSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery = target.value;
  }

  // Handle filter change
  function handleFilter(filter: string) {
    activeFilter = filter;
  }

  // Debounce function
  function debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Create debounced search handler
  const debouncedSearch = debounce(handleSearch, 300);
</script>

<section class="filters">
  <div class="filter-buttons">
    <button 
      class="filter-btn" 
      class:active={activeFilter === 'all'}
      on:click={() => handleFilter('all')}
    >
      All
    </button>
    <button 
      class="filter-btn" 
      class:active={activeFilter === 'npm'}
      on:click={() => handleFilter('npm')}
    >
      NPM Packages
    </button>
    <button 
      class="filter-btn" 
      class:active={activeFilter === 'library'}
      on:click={() => handleFilter('library')}
    >
      Libraries
    </button>
    <button 
      class="filter-btn" 
      class:active={activeFilter === 'tool'}
      on:click={() => handleFilter('tool')}
    >
      Tools
    </button>
  </div>
  <div class="search-box">
    <input 
      type="text" 
      placeholder="Search packages... 🔍"
      on:input={debouncedSearch}
      bind:value={searchQuery}
    >
  </div>
</section>

<section class="packages">
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading awesome packages... ⏳</p>
    </div>
  {:else if error}
    <div class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <p>Oops! Something went wrong while fetching packages. (╯°□°)╯</p>
      <button on:click={loadRepositories} class="retry-btn">Try Again</button>
    </div>
  {:else if filteredRepositories.length === 0}
    <div class="no-results">
      <i class="fas fa-search"></i>
      <p>No packages found matching your criteria. ¯\_(ツ)_/¯</p>
    </div>
  {:else}
    <div class="packages-grid">
      {#each filteredRepositories as repository (repository.id)}
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
