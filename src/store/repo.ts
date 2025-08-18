import { writable } from 'svelte/store';

export const repoStore = writable<RepoData[]>([]);
export const repoStats = writable<{ total: number; npm: number }>({ total: 0, npm: 0 });

export async function loadRepoData(getRepoInfo: () => Promise<RepoData[]>) {
  try {
    const data = await getRepoInfo();
    repoStore.set(data);
    repoStats.set({
      total: data.length,
      npm: data.filter((r) => r.is_npm_package).length,
    });
  } catch (e) {
    console.log('loadRepoData failed:', e);
    repoStore.set([]);
    repoStats.set({
      total: 0,
      npm: 0,
    });
  }
}
