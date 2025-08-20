import { writable } from 'svelte/store';
import persis from '@/persistance/index.js';

/**
 * LocalStorage key, also attribute name
 */
const KEY = 'theme';

const createThemeStore = () => {
  const saved = persis.load<Theme>(KEY) ?? 'light';
  const themeStore = writable<Theme>(saved);

  return {
    toggle: () => {
      themeStore.update((current) => {
        const newTheme = current === 'light' ? 'light' : 'dark';
        persis.save(KEY, newTheme);
        document.body.setAttribute(KEY, newTheme);
        return newTheme;
      });
    },
    init: () => document.body.setAttribute(KEY, saved),
    themeStore,
  };
};
const { toggle, init, themeStore } = createThemeStore();
export { toggle, init, themeStore };
