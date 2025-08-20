<script lang="ts">
  import { t } from '@/common/i18n.ts';

  let dialog: HTMLDialogElement;

  export function open() {
    dialog.showModal();
  }

  export function close() {
    dialog.close();
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === dialog) {
      close();
    }
  }
</script>

<dialog bind:this={dialog} on:click={handleBackdropClick} class="contact-dialog">
  <div class="dialog-content">
    <header class="dialog-header">
      <h2 class="dialog-title">
        <i class="fas fa-handshake"></i>
        {t('collaborateWithMe') || '与我合作'}
      </h2>
      <button type="button" class="close-btn" on:click={close} aria-label="Close dialog">
        <i class="fas fa-times"></i>
      </button>
    </header>

    <div class="dialog-body">
      <div class="collaboration-section">
        <div class="section-header">
          <i class="fas fa-code"></i>
          <h3>{t('customDevelopment') || '定制开发服务'}</h3>
        </div>
        <p class="section-description">
          {t('developmentDescription') ||
            '我提供高质量的前端开发、全栈应用开发和技术咨询服务。如果您有项目需求，欢迎联系我！'}
        </p>
        <ul class="service-list">
          <li><i class="fas fa-check"></i> {t('frontendDev') || '前端应用开发'}</li>
          <li><i class="fas fa-check"></i> {t('fullstackDev') || '全栈解决方案'}</li>
          <li><i class="fas fa-check"></i> {t('techConsulting') || '技术咨询'}</li>
          <li><i class="fas fa-check"></i> {t('projectMaintenance') || '项目维护'}</li>
        </ul>
      </div>

      <div class="support-section">
        <div class="section-header">
          <i class="fas fa-heart"></i>
          <h3>{t('supportMyWork') || '支持我的工作'}</h3>
        </div>
        <p class="section-description">
          {t('supportDescription') ||
            '如果您觉得我的开源项目对您有帮助，欢迎打赏支持！您的支持是我继续创作的动力 🌟'}
        </p>

        <div class="qr-code-container">
          <div class="qr-placeholder">
            <i class="fas fa-qrcode"></i>
            <p>{t('qrCodePlaceholder') || '扫码打赏'}</p>
            <small>{t('qrCodeNote') || '请添加您的二维码图片'}</small>
          </div>
        </div>
      </div>

      <div class="contact-section">
        <div class="section-header">
          <i class="fas fa-envelope"></i>
          <h3>{t('getInTouch') || '联系方式'}</h3>
        </div>
        <div class="contact-methods">
          <a href="mailto:futami16237@gmail.com" class="contact-method">
            <i class="fas fa-envelope"></i>
            <span>futami16237@gmail.com</span>
          </a>
          <div class="contact-method">
            <i class="fas fa-clock"></i>
            <span>{t('responseTime') || '通常24小时内回复'}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</dialog>

<style>
  .contact-dialog {
    margin: auto;
    padding: 0;
    border: none;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    background: var(--surface);
    color: var(--text-primary);
    max-width: 500px;
    width: 90vw;
    max-height: 80vh;
    overflow: hidden;
  }

  .contact-dialog::backdrop {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
  }

  .dialog-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    background: var(--gradient);
    color: white;
  }

  .dialog-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background-color 0.3s ease;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .dialog-body {
    padding: 2rem;
    overflow-y: auto;
    flex: 1;
  }

  .collaboration-section,
  .support-section,
  .contact-section {
    margin-bottom: 2rem;
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
    margin-bottom: 1rem;
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
    margin-bottom: 1.5rem;
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
    justify-content: center;
    margin: 1.5rem 0;
  }

  .qr-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 200px;
    background: var(--surface-light);
    border: 2px dashed var(--border);
    border-radius: 12px;
    color: var(--text-muted);
    text-align: center;
    padding: 1rem;
  }

  .qr-placeholder i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--text-muted);
  }

  .qr-placeholder p {
    margin: 0.5rem 0;
    font-weight: 500;
  }

  .qr-placeholder small {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .contact-methods {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .contact-method {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--surface-light);
    border-radius: 8px;
    text-decoration: none;
    color: var(--text-secondary);
    transition: all 0.3s ease;
  }

  .contact-method:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-1px);
  }

  .contact-method i {
    color: var(--primary-color);
    font-size: 1.1rem;
    width: 20px;
    text-align: center;
  }

  .contact-method:hover i {
    color: white;
  }

  @media (max-width: 768px) {
    .contact-dialog {
      width: 95vw;
      max-height: 90vh;
    }

    .dialog-header,
    .dialog-body {
      padding: 1.5rem;
    }

    .qr-placeholder {
      width: 160px;
      height: 160px;
    }

    .qr-placeholder i {
      font-size: 2.5rem;
    }
  }
</style>
