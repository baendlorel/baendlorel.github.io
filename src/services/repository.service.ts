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
  async getData(): Promise<{ repoInfo: RepoInfo[]; featured: string[] }> {
    const raw = await this.load(
      'repo-data.compressed.js' satisfies RepoDataFile,
      'CORS_GET_REPO_DATA' satisfies RepoDataMethod
    );
  }
}

const repositoryService = new RepositoryService();
export default repositoryService;
