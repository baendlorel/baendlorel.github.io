// Node.js script to fetch GitHub repo and NPM info, then output to public/data.json

import { writeFileSync } from 'node:fs';
import fetch from 'node-fetch';

const GITHUB_USERNAME = 'baendlorel';
const GITHUB_API_BASE = 'https://api.github.com';
const NPM_REGISTRY = 'https://registry.npmjs.org/';
const OUTPUT_PATH = './repo-info.js';

async function fetchRepos() {
  const res = await fetch(
    `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
  );
  if (!res.ok) {
    throw new Error('GitHub API error: ' + res.status);
  }
  const repos = (await res.json()) as RepoInfo[];
  // return repos.filter((repo) => !repo.fork && !repo.private);
  return repos.filter((repo) => !repo.private);
}

async function fetchNpmInfo(pkgName): Promise<NpmInfo | null> {
  try {
    const res = await fetch(`${NPM_REGISTRY}${pkgName}`);
    if (!res.ok) return null;
    const npmData = (await res.json()) as NpmInfo;
    return {
      version: npmData['dist-tags']?.latest || 'unknown',
      description: npmData.description || '',
      homepage: npmData.homepage || '',
      repository: npmData.repository || { url: '' },
    };
  } catch {
    return null;
  }
}

interface PackageJson {
  name: string;
  description?: string;
}

async function enrichRepos(repos: RepoInfo[]) {
  const enrichedRepos: RepoInfo[] = [];
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    let npmInfo: NpmInfo | null = null;
    let pkgJson: PackageJson | null = null;
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
    const enriched: RepoInfo = {
      id: repo.id,
      name: repo.name,
      description: pkgJson?.description ?? repo.description,
      html_url: repo.html_url,
      private: repo.private,
      fork: repo.fork,
      license: repo.license,

      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      watchers_count: repo.watchers_count,

      language: repo.language,
      updated_at: repo.updated_at,
      homepage: repo.homepage,
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      npm: npmInfo ?? null,
      is_npm_package: !!npmInfo,
    };

    enrichedRepos.push(enriched);
  }
}

/**
 * [WARN] Method names must be the **SAME** as in `repository.service.ts`
 *
 * Supports:
 * 1. CORS_GET_REPO_INFO
 * 2. CORS_GET_FEATURED_REPO
 */
async function update() {
  const repos = await fetchRepos();
  const data = await enrichRepos(repos);
  const dataStr = JSON.stringify(data, null, 2);
  const js = `window.CORS_GET_REPO_INFO(${dataStr});`;

  writeFileSync(OUTPUT_PATH, js);
}

update();
