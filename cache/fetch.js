// @ts-check
// Node.js script to fetch GitHub repo and NPM info, then output to public/data.json
import { writeFileSync } from 'node:fs';
import fetch from 'node-fetch';

const GITHUB_USERNAME = 'baendlorel';
const GITHUB_API_BASE = 'https://api.github.com';
const NPM_REGISTRY = 'https://registry.npmjs.org/';
const OUTPUT_PATH = './fetched-data.json';

async function fetchRepos() {
  const res = await fetch(
    `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
  );
  if (!res.ok) {
    throw new Error('GitHub API error: ' + res.status);
  }
  const repos = await res.json();
  // return repos.filter((repo) => !repo.fork && !repo.private);
  return repos.filter((repo) => !repo.private);
}

async function fetchNpmInfo(pkgName) {
  try {
    const res = await fetch(`${NPM_REGISTRY}${pkgName}`);
    if (!res.ok) return null;
    const npmData = await res.json();
    return {
      version: npmData['dist-tags']?.latest || 'unknown',
      description: npmData.description || '',
      homepage: npmData.homepage || '',
      repository: npmData.repository?.url || '',
    };
  } catch {
    return null;
  }
}

async function enrichRepos(repos) {
  return Promise.all(
    repos.map(async (repo) => {
      let npmInfo = null;
      try {
        const pkgRes = await fetch(
          `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/contents/package.json`
        );
        if (pkgRes.ok) {
          const pkgData = await pkgRes.json();
          const pkgContent = JSON.parse(Buffer.from(pkgData.content, 'base64').toString());
          npmInfo = await fetchNpmInfo(pkgContent.name);
        }
      } catch (e) {
        console.error(`Error fetching package.json for ${repo.name}:`, e);
      }
      return {
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        updated_at: repo.updated_at,
        homepage: repo.homepage,
        topics: repo.topics,
        npm: npmInfo ?? null,
        is_npm_package: !!npmInfo,
      };
    })
  );
}

(async () => {
  const repos = await fetchRepos();
  const data = await enrichRepos(repos);
  writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
  console.log('Data file generated:', OUTPUT_PATH);
})();
