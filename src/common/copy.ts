export const copyToClipboard =
  navigator.clipboard && window.isSecureContext
    ? (text: string): Promise<void> => {
        return navigator.clipboard.writeText(text);
      }
    : (text: string) =>
        new Promise<void>((resolve, reject) => {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed'; // 防止页面滚动
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            if (successful) {
              resolve();
            } else {
              reject(new Error('Copy command failed'));
            }
          } catch (err) {
            document.body.removeChild(textarea);
            reject(err);
          }
        });
