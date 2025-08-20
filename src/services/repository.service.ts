class RepositoryService {
  private async load<T>(url: string, resolverName: string | symbol): Promise<T> {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);

    const result = await new Promise<T>((resolve) => {
      globalThis[resolverName] = resolve;
    });
    delete globalThis[resolverName];

    script.remove();
    return result;
  }

  async getInfo(): Promise<RepoInfo[]> {
    const url =
      'https://github.com/baendlorel/baendlorel.github.io/releases/download/assets/repo-info.js';
    return await this.load(url, 'CORS_GET_REPO_INFO');
  }

  async getFeatured(): Promise<string[]> {
    const url =
      'https://github.com/baendlorel/baendlorel.github.io/releases/download/assets/featured-repo.js';
    return await this.load(url, 'CORS_GET_FEATURED_REPO');
  }
}

const repositoryService = new RepositoryService();
export default repositoryService;
