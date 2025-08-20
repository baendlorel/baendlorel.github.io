export const pop = (options: { x: number; y: number; msg: string }) => {
  const div = document.createElement('div');
  div.textContent = options.msg;
  div.setAttribute(
    'style',
    `
    position: fixed;
    left: ${options.x}px;
    top: ${options.y}px;
    background: var(--gradient);
    color: #fff;
    padding: 0.3em 0.8em;
    border-radius: 1em;
    font-size: 0.8em;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    pointer-events: none;
    z-index: 9999;
    transition: opacity 0.3s;
    opacity: 1;
  `
  );
  document.body.appendChild(div);
  setTimeout(() => {
    div.style.opacity = '0';
    setTimeout(() => document.body.removeChild(div), 300);
  }, 1000);
};
