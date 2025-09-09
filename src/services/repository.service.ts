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
    const featured = decompressFromBase64(b).split(DELIMITER);
    const serializedRepos = decompressFromBase64(a);
    const serialized = JSON.parse(serializedRepos) as any[][];
    const info = serialized.map((r) => {
      const isPrivate = r[5];
      const repo: RepoInfo = {
        id: r[0],
        name: r[1],
        html_url: isPrivate ? '' : 'https://github.com/baendlorel/' + r[1],
        description: r[2],
        description_zh: r[3],
        purpose: r[4],
        private: isPrivate,
        fork: r[6],
        license: r[7],
        stargazers_count: r[8],
        forks_count: r[9],
        watchers_count: r[10],
        language: r[11],
        updated_at: r[12],
        topics: r[13],
        npm: r[14],
        is_npm_package: r[14] !== null,
      };
      return repo;
    });

    return { featured, info };
  }
}

const repositoryService = new RepositoryService();
export default repositoryService;
