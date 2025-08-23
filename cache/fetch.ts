// Node.js script to fetch GitHub repo and NPM info, then output to public/data.json

import { writeFileSync } from 'node:fs';
import fetch from 'node-fetch';
import lz from 'lz-string';

const GITHUB_USERNAME = 'baendlorel';
const GITHUB_API_BASE = 'https://api.github.com';
const NPM_REGISTRY = 'https://registry.npmjs.org/';
const DELIMITER: SimpleArrayDelimiter = '||';

const FEATURED = [
  'reflect-deep',
  'colorful-titlebar',
  'archiver',
  'rollup-plugin-dts-merger',
  'rollup-plugin-conditional-compilation',
  '2ality-javascript-decorators-document',
  'wildcard-event',
  'singleton-pattern',
  'probability-branch',
  'function-feature',
  'get-function-features',
  'whisper-asr-spa',
  'cpp-comment-generator',
];

const REPO_DATA_PATH: RepoDataFile = 'repo-data.compressed.js';
const REPO_DATA_METHOD: RepoDataMethod = 'CORS_GET_REPO_DATA';

function normalizeDescription(str: string, period: string = '.') {
  str = str || '';
  if (str.endsWith(period)) {
    return str;
  } else if (str) {
    return str + period;
  } else {
    return str;
  }
}

// todo 使用压缩方法减小数据大小
// todo  Some day, there might be more than 100 repos, need to handle pagination
async function fetchRepos(): Promise<RawRepoInfo[]> {
  const res = await fetch(
    `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
  );
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}, ${res.statusText}`);
  }
  const repos = (await res.json()) as any[];
  // return repos.filter((repo) => !repo.fork && !repo.private);
  return repos.filter((repo) => !repo.private) as RawRepoInfo[];
}

async function fetchNpmInfo(pkgName): Promise<NpmInfo | null> {
  try {
    const res = await fetch(`${NPM_REGISTRY}${pkgName}`);
    if (!res.ok) return null;
    const npmData = (await res.json()) as NpmInfo;
    return {
      version: npmData['dist-tags']?.latest || 'unknown',
    };
  } catch {
    return null;
  }
}

interface PackageJson {
  name: string;
  description?: string;
  description_zh?: string;
  purpose?: RepoPurpose;
}

async function enrichRepos(repos: RawRepoInfo[]): Promise<RawRepoInfo[]> {
  const enrichedRepos: RawRepoInfo[] = [];
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    let npmInfo: NpmInfo | null = null;
    let pkgJson: PackageJson = {} as PackageJson;
    try {
      const pkgRes = await fetch(
        `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/contents/package.json`
      );
      if (pkgRes.ok) {
        const pkgData = (await pkgRes.json()) as { content: string };
        pkgJson = JSON.parse(Buffer.from(pkgData.content, 'base64').toString()) as {
          name: string;
          description?: string;
        };
        npmInfo = await fetchNpmInfo(pkgJson.name);
      }
    } catch (e) {
      console.error(`Error fetching package.json for ${repo.name}:`, e);
    }

    const description = normalizeDescription(pkgJson.description ?? repo.description);
    const description_zh = pkgJson.description_zh
      ? normalizeDescription(pkgJson.description_zh, '。')
      : description;

    const enriched: RawRepoInfo = {
      id: repo.id,
      name: repo.name,
      description,
      description_zh,
      purpose: pkgJson.purpose ?? (npmInfo ? 'npm' : 'other'),
      fork: repo.fork,
      license: repo.license ?? null,

      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      watchers_count: repo.watchers_count,

      language: repo.language,
      updated_at: repo.updated_at,
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      npm: npmInfo ?? null,
    };

    enrichedRepos.push(enriched);
  }

  return enrichedRepos;
}

function serializeRepoInfo(enrichedRepos: RawRepoInfo[]): string {
  const list = enrichedRepos.map((r) => {
    // & serialize in order
    // const enriched: RepoInfo = {
    //   id: repo.id,
    //   name: repo.name,
    //   description,
    //   description_zh,
    //   purpose: pkgJson.purpose ?? (npmInfo ? 'npm' : 'other'),
    //   ^ html_url: repo.html_url, // omit to save space, equals 'https://github.com/baendlorel/'+r.name
    //   ^ private: repo.private, // omit to save space, already filtered out private repos
    //   fork: repo.fork,
    //   license: repo.license,
    //   stargazers_count: repo.stargazers_count,
    //   forks_count: repo.forks_count,
    //   watchers_count: repo.watchers_count,
    //   language: repo.language,
    //   updated_at: repo.updated_at,
    //   topics: Array.isArray(repo.topics) ? repo.topics : [],
    //   npm: npmInfo ?? null,
    //   is_npm_package: !!npmInfo,
    // };
    const entry = [
      r.id,
      r.name,
      r.description,
      r.description_zh,
      r.purpose,
      r.fork,
      r.license?.spdx_id || '',
      r.stargazers_count,
      r.forks_count,
      r.watchers_count,
      r.language ?? '',
      new Date(r.updated_at).getTime(),
      r.topics.join(DELIMITER),
      r.npm,
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
