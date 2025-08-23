<script lang="ts">
  import alipayZh from '@/assets/alipay-zh.jpg';
  import alipayEn from '@/assets/alipay-en.png';
  import { t, lang } from '@/common/i18n.js';
</script>

<div class="dialog-body">
  <div class="contact-section">
    <div class="section-header">
      <i class="fas fa-envelope"></i>
      <h3>
        {t('getInTouch')}
      </h3>
    </div>
    <div class="contact-methods">
      <a href="mailto:futami16237@gmail.com?subject=Development%20Request" class="contact-method">
        futami16237@gmail.com (。・∀・)ノ
      </a>
      <span>{t('responseTime')}</span>
    </div>
  </div>
  <div class="collaboration-section">
    <div class="section-header">
      <i class="fas fa-code"></i>
      <h3>{t('customDevelopment')}</h3>
    </div>
    <p class="section-description">
      {t('developmentDescription')}
    </p>
    <ul class="service-list">
      <li><i class="fas fa-check"></i> {t('frontendDev')}</li>
      <li><i class="fas fa-check"></i> {t('fullstackDev')}</li>
      <li><i class="fas fa-check"></i> {t('techConsulting')}</li>
    </ul>
  </div>
  <div class="support-section">
    <div class="section-header">
      <i class="fas fa-heart"></i>
      <h3>{t('supportMyWork')}</h3>
    </div>
    <p class="section-description">
      {t('supportDescription')}
    </p>

    <div class="qr-code-container">
      {#if lang === 'en'}
        <img src={alipayEn} alt="zfb-qr" style="width:100%" />
      {:else}
        <img src={alipayZh} alt="zfb-qr" style="width:100%" />
      {/if}
    </div>
  </div>
</div>

<style>
  /** contact */

  .collaboration-section,
  .support-section,
  .contact-section {
    margin-bottom: 1.5rem;
  }

  .collaboration-section:last-child,
  .support-section:last-child,
  .contact-section:last-child {
    margin-bottom: 0;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.8rem;
  }

  .section-header i {
    color: var(--primary-color);
    font-size: 1.25rem;
  }

  .section-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .section-description {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .service-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .service-list li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0;
    color: var(--text-secondary);
  }

  .service-list i {
    color: var(--accent-color);
    font-size: 0.9rem;
  }

  .qr-code-container {
    display: flex;
    margin: auto;
    justify-content: center;
    width: 80%;
    border: 4px dashed var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  .contact-methods {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .contact-method {
    display: flex;
    color: var(--secondary-color);
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .contact-method:hover {
    color: var(--primary-color);
    text-decoration: underline;
  }
</style>
