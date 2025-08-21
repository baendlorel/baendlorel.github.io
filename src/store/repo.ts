import { writable } from 'svelte/store';
import repositoryService from '@/services/repository.service.js';
import persis from '@/persistance/index.js';

export const repoStore = writable<RepoInfo[]>([]);
export const featuredRepoStore = writable<RepoInfo[]>([]);
export const repoStats = writable<{ total: number; npm: number }>({ total: NaN, npm: NaN });
export const repoLoading = writable<boolean>(false);
export const repoError = writable<boolean>(false);

const KEY = 'repo-info';

interface RepoData {
  info: RepoInfo[];
  featured: string[];
}

async function getInfo() {
  const saved = persis.load<RepoData>(KEY);
  if (saved !== null) {
    return saved;
  }
  const info = await repositoryService.getInfo();
  if (__IS_DEV__) {
    info[0].purpose = 'app'; // Ensure at least one is an app
    info[1].purpose = 'rollup-plugin'; // Ensure at least one is an app
    info[2].purpose = 'vscode-extension'; // Ensure at least one is an app
  }
  const featured = await repositoryService.getFeatured();
  persis.save(KEY, { info, featured });
  return { info, featured };
}

export async function loadRepoData() {
  try {
    repoLoading.set(true);
    const { info, featured: featuredNames } = await getInfo();

    const featured: RepoInfo[] = [];
    for (let i = 0; i < featuredNames.length; i++) {
      const found = info.find((r) => r.name === featuredNames[i]);
      if (found) {
        featured.push(found);
      } else {
        console.warn(`Featured repo "${featuredNames[i]}" not found in 'repoInfo'`);
      }
    }

    featuredRepoStore.set(featured);
    repoStore.set(info);
    repoStats.set({
      total: info.length,
      npm: info.filter((r) => r.is_npm_package).length,
    });
  } catch (e) {
    console.log('loadRepoData failed:', e);
    repoError.set(true);
  } finally {
    repoLoading.set(false);
  }
}
