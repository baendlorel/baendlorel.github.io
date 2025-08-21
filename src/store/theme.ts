import { writable } from 'svelte/store';
import persis from '@/persistance/index.js';

/**
 * LocalStorage key, also attribute name
 */
const KEY = 'theme';

const createThemeStore = () => {
  const saved = persis.load<Theme>(KEY) ?? 'light';
  const themeStore = writable<Theme>(saved);

  const apply = (theme: string) => {
    document.documentElement.setAttribute(KEY, theme);
  };

  return {
    toggle: () => {
      themeStore.update((current) => {
        const newTheme = current === 'light' ? 'dark' : 'light';
        persis.save(KEY, newTheme);
        apply(newTheme);
        return newTheme;
      });
    },
    init: () => apply(saved),
    themeStore,
  };
};
const { toggle, init, themeStore } = createThemeStore();
export { toggle, init, themeStore };
