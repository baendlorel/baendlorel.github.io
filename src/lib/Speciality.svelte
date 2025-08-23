<script lang="ts">
  import { t } from '@/common/i18n.js';

  const specialities: SpecialityItem[] = [
    { name: 'JavaScript / TypeScript', level: 3, progress: 100 },
    { name: 'Node.js', level: 3, progress: 100 },
    { name: 'Vue.js', level: 3, progress: 100 },
    { name: 'Svelte', level: 1, progress: 60 },
    { name: 'Rust', level: 1, progress: 75 },
    { name: 'C++', level: 1, progress: 30 },
    { name: 'PHP', level: 1, progress: 50 },
    { name: 'Python', level: 1, progress: 20 },
  ];

  function getIcon(name: string): string {
    const map = {
      'JavaScript / TypeScript': 'kskb-icon kskb-typescript',
      'Node.js': 'kskb-icon kskb-nodejs',
      'Vue.js': 'kskb-icon kskb-vue',
      Svelte: 'kskb-icon kskb-svelte',
      Rust: 'fas fa-cogs',
      'C++': 'fas fa-code',
      PHP: 'fab fa-php',
      Python: 'fab fa-python',
    };
    return map[name] || 'fas fa-code';
  }

  function getColor(progress: number): string {
    if (progress >= 80) {
      return '#4CAF50'; // green
    } else if (progress >= 60) {
      return '#8BC34A'; // light green
    } else if (progress >= 40) {
      return '#FFC107'; // amber
    } else if (progress >= 20) {
      return '#FF9800'; // orange
    }
    return '#FFD700';
  }
</script>

<div class="speciality-container">
  <div class="speciality-list">
    {#each specialities as item (item.name)}
      <div class="speciality-item" data-level={item.level}>
        <div class="item-header">
          <div class="item-info">
            <div class="item-name">
              <i class={getIcon(item.name)} style="margin-right: 3px"></i>
              {item.name}
            </div>
          </div>
          <div class="item-description">
            {t('specialityLevel')[item.level]}
          </div>
        </div>

        <div class="progress-container">
          <div class="progress-bar">
            <div
              class="progress-fill"
              style="width: {item.progress}%; background-color: {getColor(item.progress)}"
            ></div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .speciality-container {
    padding: 1.5rem;
    background: var(--surface);
    border-radius: 12px;
  }

  .speciality-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .speciality-item {
    background: var(--surface-light);
    border-radius: 12px;
    padding: 0.4rem 1rem;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }

  .speciality-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-color);
  }

  .item-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.2rem;
  }

  .item-info {
    flex: 1;
  }

  .item-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .item-description {
    font-size: 0.9rem;
    color: var(--text-muted);
    font-style: italic;
  }

  .progress-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .progress-bar {
    flex: 1;
    height: 8px;
    background: var(--border);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 4px;
    transition: all 0.3s ease;
    position: relative;
  }

  .progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.32), transparent);
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  @media (max-width: 768px) {
    .speciality-container {
      padding: 1rem;
    }

    .item-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .item-info {
      text-align: center;
      width: 100%;
    }

    .progress-container {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
