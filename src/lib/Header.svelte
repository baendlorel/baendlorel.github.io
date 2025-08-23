<script lang="ts">
  import { t } from '@/common/i18n.js';
  import { repoStats } from '@/store/repo.js';
  import avatar from '@/assets/avatar.jpg';

  import ThemeControls from './ThemeControls.svelte';
  import Contact from './Contact.svelte';
  import Dialog from './Dialog.svelte';

  let contactDialog: Dialog;

  function openContactDialog() {
    contactDialog.open();
  }
</script>

<header class="header">
  <div class="header-content">
    <div class="profile-section">
      <div class="avatar">
        <!-- <i class="fas fa-user-circle"></i> -->
        <img src={avatar} alt="Avatar" width="80" height="80" style="border-radius: 50%;" />
      </div>
      <div class="profile-info">
        <h1 class="name">Kasukabe Tsumugi</h1>

        <p class="bio">✨ {t('bio')} ✨</p>
        <div class="contact-info">
          <a href="mailto:futami16237@gmail.com" class="email">
            <i class="fas fa-envelope"></i>
            futami16237@gmail.com
          </a>
          <button
            type="button"
            class="collaborate-btn"
            on:click={openContactDialog}
            title={t('collaborateWithMe')}
          >
            <i class="fas fa-handshake"></i>
            <span>{t('collaborate')}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="header-actions">
      <div class="stats">
        <div class="stat-item">
          <span class="stat-number">{$repoStats.total}</span>
          <span class="stat-label">{t('repositories')}</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{$repoStats.npm}</span>
          <span class="stat-label">{t('npmPackages')}</span>
        </div>
      </div>
      <ThemeControls />
    </div>
  </div>
</header>

<Dialog bind:this={contactDialog} closeBtn={true}>
  <div slot="header">
    <h2 class="dialog-title">
      <i class="fas fa-handshake"></i>
      {t('collaborateWithMe')}
    </h2>
  </div>
  <Contact slot="body" />
</Dialog>

<style>
  .header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 2rem 0;
    position: relative;
    overflow: hidden;
  }

  .header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gradient);
    opacity: 0.1;
    z-index: 0;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;
    gap: 2rem;
  }

  .header-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1rem;
  }

  .profile-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: white;
    box-shadow: 0 8px 32px var(--shadow);
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .name {
    font-size: 2.5rem;
    font-weight: 700;
    background: var(--gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .bio {
    font-size: 1.2rem;
    color: var(--text-secondary);
    margin: 0;
  }

  .contact-info {
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .email {
    color: var(--text-muted);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    transition: color 0.3s ease;
  }

  .email:hover {
    color: var(--primary-color);
  }

  .collaborate-btn {
    background: var(--gradient);
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
  }

  .collaborate-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .stats {
    display: flex;
    gap: 2rem;
  }

  .stat-item {
    text-align: center;
    padding: 1rem;
    background: var(--surface-light);
    border-radius: 12px;
    border: 1px solid var(--border);
    min-width: 120px;
  }

  .stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.9rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      text-align: center;
      gap: 2rem;
    }

    .profile-section {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .header-actions {
      align-items: center;
    }

    .name {
      font-size: 2rem;
    }

    .stats {
      gap: 1rem;
    }

    .stat-item {
      min-width: 100px;
      padding: 0.75rem;
    }

    .contact-info {
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
    }

    .collaborate-btn span {
      display: none;
    }

    .collaborate-btn {
      padding: 0.5rem;
      min-width: 40px;
      justify-content: center;
    }
  }
</style>
