<script lang="ts">
  export let closeBtn = false;

  let dialogContainer: HTMLDivElement;
  let isClosing = false;
  let isVisible = false;

  export function open() {
    isVisible = true;
    document.body.style.overflow = 'hidden'; // 防止背景滚动
    requestAnimationFrame(() => {
      dialogContainer.classList.add('dialog-opening');
    });
  }

  export function close() {
    if (isClosing) {
      return;
    }

    isClosing = true;
    dialogContainer.classList.add('dialog-closing');

    setTimeout(() => {
      isVisible = false;
      document.body.style.overflow = '';
      dialogContainer.classList.remove('dialog-opening', 'dialog-closing');
      isClosing = false;
    }, 300); // same time as the CSS animation duration
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === dialogContainer) {
      close();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isVisible) {
      close();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isVisible}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    bind:this={dialogContainer}
    on:click={handleBackdropClick}
    class="dialog-overlay"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div class="dialog">
      <div class="dialog-content">
        <header class="dialog-header">
          <slot name="header" />
          {#if closeBtn}
            <button type="button" class="close-btn" on:click={close} aria-label="Close dialog">
              <i class="fas fa-times"></i>
            </button>
          {/if}
        </header>
        <div class="dialog-body-wrapper">
          <slot name="body" />
        </div>

        <slot name="footer" />
      </div>
    </div>
  </div>
{/if}

<style>
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    /* Remove backdrop-filter for iOS compatibility */
    /* backdrop-filter: blur(4px); */
    opacity: 0;
    transition: all 0.3s ease;
  }

  .dialog {
    margin: auto;
    padding: 0;
    border: none;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    background: var(--surface);
    color: var(--text-primary);
    max-width: 500px;
    width: 90vw;
    max-height: 90vh;
    overflow: hidden;

    /* Initial state */
    opacity: 0;
    transform: scale(0.7);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Popup animation */
  :global(.dialog-overlay.dialog-opening) {
    opacity: 1;
  }

  :global(.dialog-overlay.dialog-opening) .dialog {
    opacity: 1;
    transform: scale(1);
  }

  /* Close animation */
  :global(.dialog-overlay.dialog-closing) {
    opacity: 0;
    transition: all 0.3s ease-in;
  }

  :global(.dialog-overlay.dialog-closing) .dialog {
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.3s ease-in;
  }

  .dialog-content {
    display: grid;
    grid-template-rows: auto 1fr auto; /* header, body, footer */
    height: 100%;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s;
  }

  .dialog-header {
    grid-row: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    background: var(--gradient);
    color: white;
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
    grid-row: 2;
    overflow-y: auto;
    max-height: 75vh; /* needs this to ensure scrolling */
    /* Fix iOS scroll issues */
    -webkit-overflow-scrolling: touch;
  }

  /* footer slot will take 3rd row automatically */

  /* Content popup animation */
  :global(.dialog-overlay.dialog-opening) .dialog-content {
    transform: translateY(0);
    opacity: 1;
  }

  /* Content close animation */
  :global(.dialog-overlay.dialog-closing) .dialog-content {
    transform: translateY(-10px);
    opacity: 0;
    transition: all 0.2s ease-in;
  }

  /* Header and footer styles - only apply if they have content */
  .dialog-content :global(.dialog-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    background: var(--gradient);
    color: white;
  }

  .dialog-content :global(.dialog-footer) {
    padding: 1rem 2rem;
    border-top: 1px solid var(--border);
    background: var(--surface-secondary, var(--surface));
  }

  .dialog-content :global(.dialog-title) {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .dialog-content :global(.close-btn) {
    background: none;
    border: none;
    color: white;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background-color 0.3s ease;
  }

  .dialog-content :global(.close-btn:hover) {
    background: rgba(255, 255, 255, 0.2);
  }

  .dialog-content :global(.dialog-body) {
    padding: 2rem;
    flex: 1;
  }

  @media (max-width: 768px) {
    .dialog {
      width: 95vw;
      max-height: 90vh;
    }

    .dialog-overlay {
      padding: 1rem;
    }

    .dialog-content :global(.dialog-header),
    .dialog-content :global(.dialog-footer) {
      padding: 1.5rem;
    }
    .dialog-content :global(.dialog-body) {
      padding: 1.5rem 1.5rem 4.5rem 1.5rem;
    }
  }
</style>
