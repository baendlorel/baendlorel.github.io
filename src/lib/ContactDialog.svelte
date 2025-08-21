<script lang="ts">
  import alipayZh from '@/assets/alipay-zh.jpg';
  import alipayEn from '@/assets/alipay-en.png';
  import { t, lang } from '@/common/i18n.ts';

  let dialog: HTMLDialogElement;
  let isClosing = false;

  export function open() {
    dialog.showModal();
    requestAnimationFrame(() => {
      dialog.classList.add('dialog-opening');
    });
  }

  export function close() {
    if (isClosing) {
      return;
    }

    isClosing = true;
    dialog.classList.add('dialog-closing');

    setTimeout(() => {
      dialog.close();
      dialog.classList.remove('dialog-opening', 'dialog-closing');
      isClosing = false;
    }, 300); // same time as the CSS animation duration
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
        {t('collaborateWithMe')}
      </h2>
      <button type="button" class="close-btn" on:click={close} aria-label="Close dialog">
        <i class="fas fa-times"></i>
      </button>
    </header>

    <div class="dialog-body-wrapper">
      <div class="dialog-body">
        <div class="contact-section">
          <div class="section-header">
            <i class="fas fa-envelope"></i>
            <h3>
              {t('getInTouch')}
            </h3>
          </div>
          <div class="contact-methods">
            <a href="mailto:futami16237@gmail.com" class="contact-method">
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
    /* max-height: 80vh; */
    overflow: hidden;

    /* Initial state */
    opacity: 0;
    transform: scale(0.7) translateY(-20px);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Popup animation */
  :global(.contact-dialog.dialog-opening) {
    opacity: 1;
    transform: scale(1) translateY(0);
  }

  /* Close animation */
  :global(.contact-dialog.dialog-closing) {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
    transition: all 0.3s ease-in;
  }

  .contact-dialog::backdrop {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    opacity: 0;
    transition: all 0.3s ease;
  }

  /* Backdrop fade-in animation */
  :global(.contact-dialog.dialog-opening::backdrop) {
    opacity: 1;
  }

  /* Backdrop fade-out animation */
  :global(.contact-dialog.dialog-closing::backdrop) {
    opacity: 0;
  }

  .dialog-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s;
  }

  /* Content popup animation */
  :global(.contact-dialog.dialog-opening) .dialog-content {
    transform: translateY(0);
    opacity: 1;
  }

  /* Content close animation */
  :global(.contact-dialog.dialog-closing) .dialog-content {
    transform: translateY(-10px);
    opacity: 0;
    transition: all 0.2s ease-in;
  }

  .dialog-header {
    display: flex;
    margin-top: -20px;
    justify-content: space-between;
    align-items: center;
    /* padding: 1.5rem 2rem; */
    padding: 40px 30px 20px 30px;
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

  .dialog-body-wrapper {
    height: 80vh;
    overflow-y: auto;
  }

  .dialog-body {
    padding: 2rem;
    flex: 1;
  }

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

  @media (max-width: 768px) {
    .contact-dialog {
      width: 95vw;
      max-height: 90vh;
    }

    .dialog-header,
    .dialog-body {
      padding: 1.5rem;
    }
  }
</style>
