import { decompressFromBase64 } from 'lz-string';

class RepositoryService {
  private async load<T>(file: string, resolverName: string | symbol): Promise<T> {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      'https://github.com/baendlorel/baendlorel.github.io/releases/download/assets/' + file;
    document.body.appendChild(script);

    const result = await new Promise<T>((resolve) => {
      globalThis[resolverName] = resolve;
    });
    delete globalThis[resolverName];

    script.remove();
    return result;
  }

  async getInfo(): Promise<RepoInfo[]> {
    return await this.load('repo-info.js', 'CORS_GET_REPO_INFO');
  }

  async getFeatured(): Promise<string[]> {
    return await this.load('featured-repo.js', 'CORS_GET_FEATURED_REPO');
  }

  // & serialized + compressed
  async getData(): Promise<{ info: RepoInfo[]; featured: string[] }> {
    const DELIMITER: SimpleArrayDelimiter = '||';
    const raw = await this.load<string>(
      'repo-data.compressed.js' satisfies RepoDataFile,
      'CORS_GET_REPO_DATA' satisfies RepoDataMethod
    );
    const [a, b] = raw.split(DELIMITER);
    const featuredSerialized = decompressFromBase64(b) ?? '';
    const featured = featuredSerialized ? featuredSerialized.split(DELIMITER) : [];
    const serializedRepos = decompressFromBase64(a) ?? '[]';
    const serialized = JSON.parse(serializedRepos) as any[][];
    const info = serialized.map((r) => {
      const isPrivate = r[5];
      const htmlUrlFromData = typeof r[15] === 'string' ? r[15] : '';
      const description = typeof r[2] === 'string' ? r[2] : '';
      const repo: RepoInfo = {
        id: r[0],
        name: r[1],
        html_url: htmlUrlFromData || (isPrivate ? '' : 'https://github.com/baendlorel/' + r[1]),
        description,
        description_zh: typeof r[3] === 'string' ? r[3] : description,
        purpose: r[4] || 'other',
        private: isPrivate,
        fork: r[6],
        license: r[7],
        stargazers_count: r[8],
        forks_count: r[9],
        watchers_count: r[10],
        language: typeof r[11] === 'string' ? r[11] : '',
        updated_at: Number(r[12]) || 0,
        topics: typeof r[13] === 'string' && r[13] ? r[13].split(DELIMITER) : [],
        npm: r[14],
        is_npm_package: r[14] !== null,
        is_monorepo: Boolean(r[16]),
        monorepo_root: typeof r[17] === 'string' ? r[17] : '',
      };
      return repo;
    });

    return { featured, info };
  }
}

const repositoryService = new RepositoryService();
export default repositoryService;
