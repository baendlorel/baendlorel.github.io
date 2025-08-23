<script lang="ts">
  import { t, lang } from '@/common/i18n.js';

  const specialities: SpecialityItem[] = [
    {
      name: 'JavaScript / TypeScript',
      level: 3,
      progress: 100,
      description: {
        en: '6 years development experience, also main language of my work',
        zh: '6年开发经验，也是工作主用',
      },
    },
    {
      name: 'Node.js',
      level: 3,
      progress: 100,
      description: {
        en: '6 years development experience, also main framework of my work',
        zh: '6年开发经验，也是工作主用',
      },
    },
    {
      name: 'Vue.js',
      level: 3,
      progress: 100,
      description: {
        en: '6 years development experience, also main framework of my work',
        zh: '6年开发经验，也是工作主用',
      },
    },
    {
      name: 'Svelte',
      level: 1,
      progress: 60,
      description: {
        en: 'This page is made of Svelte (。・∀・)ノ',
        zh: '本网页就是用Svelte编写的 (。・∀・)ノ',
      },
    },
    {
      name: 'Rust',
      level: 1,
      progress: 58,
      description: {
        en: 'My terminal application "archiver" is made of this',
        zh: '我开发的终端应用“archiver”就是以此开发',
      },
    },
    {
      name: 'C++',
      level: 1,
      progress: 30,
      description: {
        en: 'My keyboard tool "umbral-keys" is made of this. Also have some experience of Unreal Engine development',
        zh: ' 我的键盘工具“umbral-keys”是以此开发的，也有一些Unreal Engine开发经验',
      },
    },
    {
      name: 'PHP',
      level: 1,
      progress: 50,
      description: {
        en: 'Experienced with maintance of a 10 year old PHP project and modifing of WordPress',
        zh: '有维护10年前PHP项目和魔改WordPress的经验',
      },
    },
    {
      name: 'Python',
      level: 0,
      progress: 15,
      description: {
        en: 'My project "whisper-asr-spa" involves some Python server developing. Not very experienced',
        zh: '我的项目“whisper-asr-spa”涉及一些Python服务器开发，但经验不多',
      },
    },
    {
      name: 'Docker',
      level: 2,
      progress: 65,
      description: { en: 'Almost same as js/ts', zh: '和js/ts几乎一样' },
    },
    {
      name: 'C#',
      level: 1,
      progress: 20,
      description: {
        en: 'Have some experience of Unity developing that involves C#',
        zh: '拥有一些Unity开发经验，涉及C#',
      },
    },
    {
      name: 'Ruby',
      level: 1,
      progress: 48,
      description: {
        en: 'I use Ruby on tool development(used by assistants and managers) and RPG Maker XP many years ago',
        zh: '我在工具开发(营业员和客户经理使用)和RPG Maker XP中使用Ruby已有多年',
      },
    },
  ].sort((a, b) => b.progress - a.progress);

  function getIcon(name: string): string {
    const map = {
      'JavaScript / TypeScript': 'kskb-icon kskb-jts',
      'Node.js': 'kskb-icon kskb-nodejs',
      'Vue.js': 'kskb-icon kskb-vue',
      Svelte: 'kskb-icon kskb-svelte',
      Rust: 'kskb-icon kskb-rust',
      'C++': 'kskb-icon kskb-cpp',
      PHP: 'kskb-icon kskb-php',
      Ruby: 'kskb-icon kskb-ruby',
      Python: 'kskb-icon kskb-python',
      Docker: 'kskb-icon kskb-docker',
      'C#': 'kskb-icon kskb-csharp',
    };
    return map[name] || 'fas fa-code';
  }

  function getColor(progress: number): string {
    if (progress >= 90) return '#24f209';
    if (progress >= 80) return '#78e50b';
    if (progress >= 70) return '#E6FF3B';
    if (progress >= 60) return '#FFF94D';
    if (progress >= 50) return '#FFD84D';
    if (progress >= 40) return '#FFB84D';
    if (progress >= 30) return '#FF984D';
    if (progress >= 20) return '#FF6B35';
    if (progress >= 10) return '#FF3B3B';
    return '#B80000';
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
              <span class="item-level-name">
                {t('specialityLevel')[item.level]}
              </span>
            </div>
          </div>
          <div class="item-info">
            {item.description[lang]}
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
    gap: 1.5rem;
  }

  .speciality-item {
    background: var(--surface-light);
    border-radius: 12px;
    padding: 0.8rem 1rem;
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
    margin-bottom: 0.6rem;
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

  .item-level-name {
    font-size: 0.9rem;
    color: var(--text-muted);
    font-style: italic;
  }

  .item-description {
    font-size: 0.85rem;
    color: var(--text-muted);
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
      width: 100%;
    }

    .progress-container {
      gap: 0.5rem;
    }
  }
</style>
