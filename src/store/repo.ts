import { writable } from 'svelte/store';
import { Consts } from '@/common/consts';
import repositoryService from '@/services/repository.service.js';
import { load, save } from './persistance';

export const repoStore = writable<RepoInfo[]>([]);
export const repoStats = writable<{ total: number; npm: number }>({ total: NaN, npm: NaN });
export const repoLoading = writable<boolean>(false);
export const repoError = writable<boolean>(false);

async function getInfo() {
  const saved = load<RepoInfo[]>(Consts.RepoInfoKey);
  if (saved !== null) {
    console.log('Loaded repo data from localStorage');
    return saved;
  }
  const data = await repositoryService.getInfo();
  save(Consts.RepoInfoKey, data);
  console.log('Loaded repo data from remote');
  return data;
}

export async function loadRepoData() {
  try {
    repoLoading.set(true);
    const data = await getInfo();
    repoStore.set(data);
    repoStats.set({
      total: data.length,
      npm: data.filter((r) => r.is_npm_package).length,
    });
  } catch (e) {
    console.log('loadRepoData failed:', e);
    repoError.set(true);
  } finally {
    repoLoading.set(false);
  }
}
