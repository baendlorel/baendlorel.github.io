<script context="module" lang="ts">
  function getLanguageColor(language: string): string {
    const colors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      C: '#555555',
      Go: '#00ADD8',
      Rust: '#dea584',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Swift: '#fa7343',
      Kotlin: '#A97BFF',
      Dart: '#00B4AB',
      Shell: '#89e051',
      HTML: '#e34c26',
      CSS: '#1572B6',
      Vue: '#4FC08D',
      Svelte: '#ff3e00',
    };
    return colors[language] || '#64748b';
  }
</script>

<script lang="ts">
  import { lang, t } from '@/common/i18n.js';
  import { copyToClipboard } from '@/common/copy.js';
  import { pop } from '@/common/pop.js';

  export let repository: RepoInfo;

  function copy(event: MouseEvent) {
    copyToClipboard(repository.name)
      .then(() => {
        pop({
          x: event.clientX,
          y: event.clientY,
          msg: t('repoNameCopied'),
        });
      })
      .catch((err) => {
        console.error('Failed to copy package name:', err);
      });
  }

  function getTypeClass(repo: RepoInfo): string {
    if (repo.is_npm_package) return 'npm';
    if (repo.topics?.includes('library')) return 'library';
    if (repo.topics?.includes('tool')) return 'tool';
    return 'other';
  }

  function getTypeIcon(repo: RepoInfo): string {
    if (repo.is_npm_package) return 'fab fa-npm';
    if (repo.topics?.includes('library')) return 'fas fa-book';
    if (repo.topics?.includes('tool')) return 'fas fa-tools';
    return 'fas fa-code';
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function trunc(description: string, maxLength: number = 120): string {
    if (!description) return 'No description available';
    return description.length > maxLength
      ? description.substring(0, maxLength) + '...'
      : description;
  }
</script>

<div class="package-card" data-type={getTypeClass(repository)}>
  <div class="package-header">
    <div class="package-icon">
      <i class={getTypeIcon(repository)}></i>
    </div>
    <div class="package-type">
      {getTypeClass(repository)}
    </div>
  </div>

  <div class="package-content">
    <h3 class="package-name">
      <button
        type="button"
        class="package-name-btn"
        aria-label="Copy package name to clipboard"
        on:click={copy}
      >
        {repository.name}
      </button>
    </h3>

    <p class="package-description">
      {trunc(repository.description)}
    </p>

    <div class="package-meta">
      <div class="meta-item">
        <i class="fas fa-star"></i>
        <span>{repository.stargazers_count}</span>
      </div>
      <div class="meta-item">
        <i class="fas fa-code-branch"></i>
        <span>{repository.forks_count}</span>
      </div>
      {#if repository.language}
        <div class="meta-item">
          <i
            class="fas fa-circle language-dot"
            style="color: {getLanguageColor(repository.language)}"
          ></i>
          <span>{repository.language}</span>
        </div>
      {/if}
    </div>

    <div class="package-footer">
      <div class="updated-date">
        Updated {formatDate(repository.updated_at)}
      </div>

      <div class="package-links">
        <a
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-outline"
        >
          <i class="fab fa-github"></i>
          {t('viewOnGitHub')}
        </a>

        {#if repository.is_npm_package}
          <a
            href="https://npmjs.com/package/{repository.name}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary"
          >
            <i class="fab fa-npm"></i>
            {t('viewOnNPM')}
          </a>
          <!-- <div class="npm-info">
            <div class="npm-badge">
              <i class="fab fa-npm"></i>
              <span>v{repository.npm.version}</span>
            </div>
            <a
              href="https://npmjs.com/package/{repository.name}"
              target="_blank"
              rel="noopener noreferrer"
              class="npm-link"
            >
              View on NPM
            </a>
          </div> -->
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .package-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .package-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--gradient);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .package-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px var(--shadow);
    border-color: var(--primary-color);
  }

  .package-card:hover::before {
    opacity: 1;
  }

  .package-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .package-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: white;
  }

  .package-type {
    padding: 0.25rem 0.75rem;
    background: var(--surface-light);
    color: var(--text-secondary);
    border-radius: 12px;
    font-size: 0.8rem;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 0.05em;
  }

  .package-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .package-name {
    margin-bottom: 0.75rem;
  }

  .package-name-btn {
    border: 0;
    background-color: transparent;
    color: var(--text-primary);
    text-decoration: none;
    font-size: 1.25rem;
    font-weight: 600;
    transition: color 0.3s ease;
  }

  .package-name-btn:hover {
    color: var(--primary-color);
  }

  .package-description {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1rem;
    flex: 1;
  }

  .package-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .language-dot {
    font-size: 0.6rem;
  }

  .npm-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: var(--surface-light);
    border-radius: 8px;
  }

  .npm-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--accent-color);
    font-weight: 500;
  }

  .npm-link {
    color: var(--primary-color);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  .npm-link:hover {
    color: var(--primary-dark);
  }

  .package-footer {
    border-top: 1px solid var(--border);
    padding-top: 1rem;
    margin-top: auto;
  }

  .updated-date {
    color: var(--text-muted);
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .package-links {
    display: flex;
    gap: 0.75rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    justify-content: center;
  }

  .btn-outline {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-secondary);
  }

  .btn-outline:hover {
    background: var(--surface-light);
    border-color: var(--primary-color);
    color: var(--text-primary);
  }

  .btn-primary {
    background: var(--gradient);
    border: 1px solid transparent;
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .package-card .btn-primary {
    border-color: var(--surface);
  }

  /* Type-specific styling */
  .package-card[data-type='npm'] .package-icon {
    background: linear-gradient(135deg, #cb3837 0%, #ff6b6b 100%);
  }

  .package-card[data-type='library'] .package-icon {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  }

  .package-card[data-type='tool'] .package-icon {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  }
</style>
