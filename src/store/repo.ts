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

function normalizeRepo(repo: RepoInfo): RepoInfo {
  const raw = repo as Partial<RepoInfo>;
  const description = raw.description ?? '';

  return {
    ...repo,
    description,
    description_zh: raw.description_zh ?? description,
    html_url: raw.html_url ?? '',
    language: raw.language ?? '',
    updated_at: Number(raw.updated_at) || 0,
    topics: Array.isArray(raw.topics) ? raw.topics : [],
    is_monorepo: Boolean(raw.is_monorepo),
    monorepo_root: typeof raw.monorepo_root === 'string' ? raw.monorepo_root : '',
  };
}

async function getInfo() {
  const saved = persis.load<RepoData>(KEY);
  if (saved !== null) {
    return saved;
  }
  // const info = await repositoryService.getInfo();
  // const featured = await repositoryService.getFeatured();
  const data = await repositoryService.getData();
  persis.save(KEY, data);
  return data;
}

export async function loadRepoData() {
  try {
    repoLoading.set(true);
    const { info, featured: featuredNames } = await getInfo();
    const normalizedInfo = info.map(normalizeRepo);
    // if (__IS_DEV__) {
    //   info[0].private = true;
    //   console.log('data', info, featuredNames);
    // }

    const featured: RepoInfo[] = [];
    const added = new Set<string>();
    for (let i = 0; i < featuredNames.length; i++) {
      const found = normalizedInfo.filter(
        (r) => r.name === featuredNames[i] || (r.is_monorepo && r.monorepo_root === featuredNames[i])
      );
      if (found.length > 0) {
        for (let j = 0; j < found.length; j++) {
          const repo = found[j];
          const key = String(repo.id);
          if (!added.has(key)) {
            added.add(key);
            featured.push(repo);
          }
        }
      } else {
        console.warn(`Featured repo "${featuredNames[i]}" not found in 'repoInfo'`);
      }
    }

    featuredRepoStore.set(featured);
    repoStore.set(normalizedInfo);
    repoStats.set({
      total: normalizedInfo.length,
      npm: normalizedInfo.filter((r) => r.is_npm_package).length,
    });
  } catch (e) {
    console.log('loadRepoData failed:', e);
    repoError.set(true);
  } finally {
    repoLoading.set(false);
  }
}
