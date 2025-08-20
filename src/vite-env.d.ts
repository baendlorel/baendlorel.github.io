/// <reference types="svelte" />
/// <reference types="vite/client" />

declare const __IS_DEV__: boolean;

type Language = 'en' | 'zh';
type Theme = 'dark' | 'light';

interface License {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}

interface RepoInfo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  fork: boolean;
  license: License | null;

  stargazers_count: number;
  forks_count: number;
  watchers_count: number;

  language: string | null;
  updated_at: string;
  homepage: string | null;
  topics: string[];
  npm: NpmInfo | null;
  is_npm_package: boolean;
}

interface NpmInfo {
  version: string;
  description: string;
  homepage: string;
  repository: { url: string };
}
