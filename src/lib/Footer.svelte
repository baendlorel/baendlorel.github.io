<script lang="ts">
  import { lang, t } from '@/common/i18n.js';
  import { formatDate } from '@/common/dtm.js';

  const lastUpdatedAt = formatDate(Number('__UPDATED_AT__'));
</script>

<footer class="footer">
  <div class="footer-content">
    <p>&copy; 2025 Kasukabe Tsumugi. {t('madeWithLove')}</p>
    <div class="social-links">
      <a
        href="https://github.com/baendlorel"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub Profile"
      >
        <i class="fab fa-github"></i>
      </a>
      <a
        href="https://npmjs.com/~baendlorel"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="NPM Profile"
      >
        <i class="fab fa-npm"></i>
      </a>
    </div>
    <p style="color: var(--text-muted)">
      {t('updatedAt')}
      {lastUpdatedAt}
    </p>
  </div>
</footer>

<style>
  .footer {
    background: var(--surface);
    border-top: 1px solid var(--border);
    padding: 2rem 0 5rem 0;
    margin-top: auto;
  }

  .footer-content {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    justify-content: space-between;
    align-items: center;
    text-align: center;
  }

  .footer-content p {
    color: var(--text-secondary);
    margin: 0;
  }

  .social-links {
    display: flex;
    gap: 1rem;
  }

  .social-links a {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--surface-light);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.3s ease;
    border: 1px solid var(--border);
  }

  .social-links a:hover {
    background: var(--gradient);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
