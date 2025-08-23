interface SpecialityItem {
  name: string;
  level: 0 | 1 | 2 | 3;
  progress: number;
  description: { en: string; zh: string };
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

interface License {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}

interface NpmInfo {
  version: string;
}

interface RawRepoInfo {
  id: number;
  name: string;
  description: string | null;
  description_zh: string | null;

  /**
   * Purpose of the repository, e.g. 'vscode-extension', 'rollup-plugin', 'npm' etc.
   * This is used to categorize the repository for display purposes.
   */
  purpose: RepoPurpose;

  fork: boolean;
  license: License | null;

  stargazers_count: number;
  forks_count: number;
  watchers_count: number;

  language: string | null;
  updated_at: string;
  topics: string[];
  npm: NpmInfo | null;
}

type RepoInfo = Merge<
  RawRepoInfo,
  {
    description: string;
    description_zh: string;
    html_url: string;
    license: string;
    language: string;
    is_npm_package: boolean;
  }
>;
