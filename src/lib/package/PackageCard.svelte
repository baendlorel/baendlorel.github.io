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
  import { formatDate } from '@/common/dtm.js';
  import { copyToClipboard } from '@/common/copy.js';
  import { pop } from '@/common/pop.js';
  import { getType, getNpmState } from './repo-detail.js';

  export let repository: RepoInfo;

  $: npmState = getNpmState(repository);

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
    return getType(repo) ?? 'other';
  }

  function getTypeIcon(repo: RepoInfo): string {
    const t = getType(repo);
    return t === 'other' ? 'fas fa-code' : `kskb-icon kskb-${t}`;
  }

  function trunc(description: string, maxLength: number = 120): string {
    if (!description) {
      return t('noDescription'); // Use i18n for no description
    }
    return description.length > maxLength
      ? description.substring(0, maxLength) + '...'
      : description;
  }

  $: description = trunc(lang === 'en' ? repository.description : repository.description_zh);
  $: npmPackageUrl = `https://npmjs.com/package/${encodeURIComponent(repository.name)}`;
</script>

<div class="package-card" class:is-monorepo={repository.is_monorepo} data-type={getTypeClass(repository)}>
  {#if repository.private}
    <div class="private-banner" aria-hidden="true">{t('privateRepoFlag')}</div>
  {/if}
  <div class="package-header">
    <div class="package-icon">
      <i class={getTypeIcon(repository)}></i>
    </div>
    <div class="package-labels">
      <div class="package-type">
        {getTypeClass(repository)}
      </div>
      {#if repository.is_monorepo}
        <div class="monorepo-tag">
          <i class="fas fa-layer-group"></i>
          {t('monorepoFlag')}
        </div>
      {/if}
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
      {description}
    </p>
    {#if repository.is_monorepo}
      <p class="monorepo-source">
        <i class="fas fa-cubes"></i>
        {t('fromMonorepo')}
        <span>{repository.monorepo_root}</span>
      </p>
    {/if}

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
        {t('updatedAt')}
        {formatDate(repository.updated_at)}
      </div>

      <div class="package-links">
        {#if repository.private}
          <button class="btn btn-outline disabled">
            <i class="fab fa-github"></i>
            {t('viewOnGitHub')}
          </button>
        {:else}
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-outline"
          >
            <i class="fab fa-github"></i>
            {t('viewOnGitHub')}
          </a>
        {/if}

        {#if npmState === 'available'}
          <a
            href={npmPackageUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary"
          >
            <i class="kskb-icon kskb-npm"></i>
            <span class="version-text"> {repository.npm.version}</span>
          </a>
        {:else if npmState === 'unavailable'}
          <button class="btn btn-primary disabled">
            <i class="kskb-icon kskb-npm"></i>
            {t('onWorking')}
          </button>
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

  .package-card.is-monorepo {
    border-color: var(--monorepo-border);
    background:
      radial-gradient(circle at top right, var(--monorepo-glow), transparent 58%),
      var(--surface);
  }

  .private-banner {
    position: absolute;
    top: 12px;
    right: -74px;
    background: linear-gradient(90deg, rgba(220, 38, 38), rgba(220, 38, 38));
    color: #fff1f1;
    padding: 8px 80px;
    transform: rotate(35deg);
    text-align: center;
    letter-spacing: 1px;
    z-index: 2;
    opacity: 0.2;
    pointer-events: none;
    border-radius: 4px;
  }

  /* Ensure overflow hidden on parent clips the banner */
  .package-card {
    overflow: hidden;
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

  .package-card.is-monorepo:hover {
    border-color: var(--monorepo-border-strong);
    box-shadow: 0 14px 42px var(--monorepo-shadow);
  }

  .package-card:hover::before {
    opacity: 1;
  }

  .package-card.is-monorepo::before {
    background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
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

  .package-labels {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .monorepo-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: var(--monorepo-tag-text);
    background: var(--monorepo-tag-bg);
    border: 1px solid var(--monorepo-border);
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

  .monorepo-source {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--monorepo-source-text);
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .monorepo-source span {
    font-family: 'Consolas', monospace;
    background: var(--monorepo-tag-bg);
    border: 1px solid var(--monorepo-border);
    color: var(--text-primary);
    border-radius: 6px;
    padding: 0.08rem 0.45rem;
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

  .package-card .btn-primary {
    border-color: var(--surface);
  }

  /* Type-specific styling */
  .package-card[data-type='npm'] .package-icon {
    background: linear-gradient(135deg, #cb3837 0%, #ff6b6b 100%);
  }

  .package-card[data-type='app'] .package-icon {
    background: linear-gradient(135deg, #059669 0%, #1bd597 100%);
  }

  .package-card[data-type='vscode-extension'] .package-icon {
    background: linear-gradient(135deg, #ffffff 0%, #dcdcdc 100%);
  }

  .package-card[data-type='rollup-plugin'] .package-icon {
    background: linear-gradient(135deg, #fff5bd 0%, #ffb86b 100%);
  }

  .package-card.is-monorepo .package-icon {
    background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  }
</style>
