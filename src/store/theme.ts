import { writable } from 'svelte/store';
import persis from '@/persistance/index.js';

const KEY = 'repo-info';

const createThemeStore = () => {
  const savedTheme = persis.load<Theme>(KEY) || 'light';
  const themeStore = writable<Theme>(savedTheme);

  return {
    set: (theme: Theme) => {
      themeStore.set(theme);
      persis.save(KEY, theme);
      applyTheme(theme);
    },
    toggle: () => {
      themeStore.update((current) => {
        const newTheme = current === 'light' ? 'light' : 'dark';
        persis.save(KEY, newTheme);
        applyTheme(newTheme);
        return newTheme;
      });
    },
    init: () => {
      applyTheme(savedTheme);
      themeStore.subscribe((theme) => {
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          const themeVars = themes[theme];
          Object.entries(themeVars).forEach(([key, value]) => {
            root.style.setProperty(key, value);
          });
        }
      });
    },
  };
};

function applyTheme(theme: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

export const themeStore = createThemeStore();

export const themes = {
  dark: {
    '--primary-color': '#6366f1',
    '--primary-dark': '#4f46e5',
    '--secondary-color': '#ec4899',
    '--accent-color': '#06d6a0',
    '--background': '#0f172a',
    '--surface': '#1e293b',
    '--surface-light': '#334155',
    '--text-primary': '#f8fafc',
    '--text-secondary': '#cbd5e1',
    '--text-muted': '#94a3b8',
    '--border': '#475569',
    '--shadow': 'rgba(0, 0, 0, 0.3)',
    '--gradient': 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
  },
  light: {
    '--primary-color': '#6366f1',
    '--primary-dark': '#4f46e5',
    '--secondary-color': '#ec4899',
    '--accent-color': '#06d6a0',
    '--background': '#ffffff',
    '--surface': '#f8fafc',
    '--surface-light': '#f1f5f9',
    '--text-primary': '#1e293b',
    '--text-secondary': '#475569',
    '--text-muted': '#64748b',
    '--border': '#e2e8f0',
    '--shadow': 'rgba(0, 0, 0, 0.1)',
    '--gradient': 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
  },
};
