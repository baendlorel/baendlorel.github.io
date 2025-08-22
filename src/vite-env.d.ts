/// <reference types="svelte" />
/// <reference types="vite/client" />

type IsSameType<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
  ? true
  : false;

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

type RepoFilter = RepoPurpose | 'all' | 'featured';

type RepoPurpose =
  | 'npm'
  | 'plugin'
  | 'rollup-plugin'
  | 'extension'
  | 'vscode-extension'
  | 'app'
  | 'other';

interface RepoInfo {
  id: number;
  name: string;
  description: string | null;
  description_zh: string | null;

  /**
   * Purpose of the repository, e.g. 'vscode-extension', 'rollup-plugin', 'npm' etc.
   * This is used to categorize the repository for display purposes.
   */
  purpose: RepoPurpose;
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
