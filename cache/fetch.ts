// Node.js script to fetch GitHub repo and NPM info, then output to public/data.json

import { writeFileSync } from 'node:fs';
import fetch from 'node-fetch';
import lz from 'lz-string';

const GITHUB_USERNAME = 'baendlorel';
const GITHUB_API_BASE = 'https://api.github.com';
const NPM_REGISTRY = 'https://registry.npmjs.org/';
const DELIMITER: SimpleArrayDelimiter = '||';
const PRIVATE_REPO_TOKEN = (process.env.PRIVATE_REPO_TOKEN ?? '').trim();
if (!PRIVATE_REPO_TOKEN) {
  throw new Error('PRIVATE_REPO_TOKEN is required.');
}
const headers: Record<string, string> = { Authorization: `Bearer ${PRIVATE_REPO_TOKEN}` };

const FEATURED = [
  'kt.js',
  'fastify-injecorator',
  'reflect-deep',
  'jetbrains-titlebar',
  'rollup-plugin-dts-merger',
  'rollup-plugin-conditional-compilation',
  '2ality-javascript-decorators-document',
  'wildcard-event',
  'archiver',
  'singleton-pattern',
  'probability-branch',
  'function-feature',
  'get-function-features',
  'whisper-asr-spa',
  'cpp-comment-generator',
];

const REPO_DATA_PATH: RepoDataFile = 'repo-data.compressed.js';
const REPO_DATA_METHOD: RepoDataMethod = 'CORS_GET_REPO_DATA';

function normalizeDescription(str: string | null | undefined, period: string = '.') {
  str = str || '';
  if (str.endsWith(period)) {
    return str;
  } else if (str) {
    return str + period;
  } else {
    return str;
  }
}

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  fork: boolean;
  license: License | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

interface PackageJson {
  name: string;
  description?: string;
  description_zh?: string;
  purpose?: RepoPurpose;
  display?: boolean;
}

interface RepoListJson {
  isMonorepo?: boolean;
  packages?: PackageJson[];
}

// todo Some day, there might be more than 100 repos, need to handle pagination
async function fetchRepos(): Promise<GithubRepo[]> {
  const res = await fetch(`${GITHUB_API_BASE}/user/repos?per_page=100&sort=updated`, { headers });
  if (!res.ok) {
    throw new Error(
      `GitHub API error: ${res.status}, ${res.statusText} , PRIVATE_REPO_TOKEN.len:[${PRIVATE_REPO_TOKEN.length}]`
    );
  }
  const repos = (await res.json()) as any[];
  // return repos.filter((repo) => !repo.fork && !repo.private);
  console.log('repos count:', repos.length, 'private count:', repos.filter((r) => r.private).length);
  return repos as GithubRepo[];
}

async function fetchNpmInfo(pkgName: string): Promise<NpmInfo | null> {
  try {
    const res = await fetch(`${NPM_REGISTRY}${encodeURIComponent(pkgName)}`);
    if (!res.ok) return null;
    const npmData = (await res.json()) as { 'dist-tags'?: { latest?: string } };
    return {
      version: npmData['dist-tags']?.latest || 'unknown',
    };
  } catch {
    return null;
  }
}

async function fetchRepoJSON<T>(repoName: string, fileName: string): Promise<T | null> {
  try {
    const fileRes = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/contents/${fileName}`, {
      headers,
    });
    if (!fileRes.ok) {
      return null;
    }

    const payload = (await fileRes.json()) as {
      content?: string;
      encoding?: string;
    };

    if (!payload.content || payload.encoding !== 'base64') {
      return null;
    }

    return JSON.parse(Buffer.from(payload.content, 'base64').toString('utf-8')) as T;
  } catch (error) {
    console.error(`Error fetching ${fileName} for ${repoName}:`, error);
    return null;
  }
}

function toRawRepoInfo(
  repo: GithubRepo,
  payload: {
    id: number | string;
    name: string;
    description?: string | null;
    description_zh?: string | null;
    purpose?: RepoPurpose;
    npm: NpmInfo | null;
    isMonorepo: boolean;
    monorepoRoot?: string;
  }
): RawRepoInfo {
  const description = normalizeDescription(payload.description ?? repo.description);
  const description_zh = payload.description_zh
    ? normalizeDescription(payload.description_zh, '。')
    : description;

  return {
    id: payload.id,
    name: payload.name,
    description,
    description_zh,
    purpose: payload.purpose ?? (payload.npm ? 'npm' : 'other'),
    private: repo.private,
    html_url: repo.private ? '' : repo.html_url,
    fork: repo.fork,
    license: repo.license ?? null,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    watchers_count: repo.watchers_count,
    language: repo.language,
    updated_at: repo.updated_at,
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    npm: payload.npm ?? null,
    is_monorepo: payload.isMonorepo,
    monorepo_root: payload.monorepoRoot ?? '',
  };
}

async function enrichRepos(repos: GithubRepo[]): Promise<RawRepoInfo[]> {
  const enrichedRepos: RawRepoInfo[] = [];
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const [pkgJson, repoListJson] = await Promise.all([
      fetchRepoJSON<PackageJson>(repo.name, 'package.json'),
      fetchRepoJSON<RepoListJson>(repo.name, 'repo-list.json'),
    ]);
    const monorepoPackages = repoListJson?.isMonorepo ? repoListJson.packages ?? [] : [];

    if (repoListJson?.isMonorepo && monorepoPackages.length > 0) {
      console.log(
        'Enriching monorepo:',
        repo.name,
        'isPrivate',
        repo.private ? 'YES' : '-',
        'packages',
        monorepoPackages.length
      );

      for (let packageIndex = 0; packageIndex < monorepoPackages.length; packageIndex++) {
        const item = monorepoPackages[packageIndex];
        if (!item || !item.name) {
          continue;
        }
        if (!item.display && repo.private) {
          continue;
        }

        const npmInfo = await fetchNpmInfo(item.name);
        enrichedRepos.push(
          toRawRepoInfo(repo, {
            id: `${repo.id}:${packageIndex}:${item.name}`,
            name: item.name,
            description: item.description ?? repo.description,
            description_zh: item.description_zh,
            purpose: item.purpose,
            npm: npmInfo,
            isMonorepo: true,
            monorepoRoot: repo.name,
          })
        );
      }
      continue;
    }

    const packageName = pkgJson?.name;
    const npmInfo = packageName ? await fetchNpmInfo(packageName) : null;
    console.log(
      'Enriching:',
      repo.name,
      'isPrivate',
      repo.private ? 'YES' : '-',
      'display',
      pkgJson?.display ? 'YES' : '-'
    );
    if (!pkgJson?.display && repo.private) {
      continue;
    }

    enrichedRepos.push(
      toRawRepoInfo(repo, {
        id: repo.id,
        name: repo.name,
        description: pkgJson?.description ?? repo.description,
        description_zh: pkgJson?.description_zh,
        purpose: pkgJson?.purpose,
        npm: npmInfo,
        isMonorepo: false,
      })
    );
  }

  return enrichedRepos;
}

function serializeRepoInfo(enrichedRepos: RawRepoInfo[]): string {
  const list = enrichedRepos.map((r) => {
    // & serialize in fixed order for compact transport
    const entry = [
      r.id,
      r.name,
      r.description,
      r.description_zh,
      r.purpose,
      r.private,
      r.fork,
      r.license?.spdx_id || '',
      r.stargazers_count,
      r.forks_count,
      r.watchers_count,
      r.language ?? '',
      new Date(r.updated_at).getTime(),
      r.topics.join(DELIMITER),
      r.npm,
      r.html_url,
      r.is_monorepo,
      r.monorepo_root,
    ];
    return entry;
  });

  return JSON.stringify(list);
}

/**
 * [WARN] Method names must be the **SAME** as in `repository.service.ts`
 */
async function update() {
  const repos = await fetchRepos();
  const enriched = await enrichRepos(repos);

  // & Compressed and unified data
  // Successfully reduced from 34.7KB to 7.8KB, and merge 2 requests to 1
  const serializedRepos = serializeRepoInfo(enriched);
  const a = lz.compressToBase64(serializedRepos);
  const b = lz.compressToBase64(FEATURED.join(DELIMITER));
  writeFileSync(REPO_DATA_PATH, `${REPO_DATA_METHOD}("${a}${DELIMITER}${b}")`);
  console.log('Finished writing compressed data.');
}

update();
