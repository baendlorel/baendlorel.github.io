/**
 * Interface for NPM package info
 */
export interface NpmInfo {
  version: string;
  description: string;
  homepage: string;
  repository: { url: string };
}

/**
 * Interface for each repo data item in fetched-data.json
 */
export interface RepoData {
  name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  homepage: string | null;
  topics: string[];
  npm: NpmInfo | null;
  is_npm_package: boolean;
}
