class RepositoryService {
  // async getInfo(): Promise<RepoInfo[]> {
  //   if (__IS_DEV__) {
  //     const data = await import('../../cache/fetched-data.json');
  //     return data.default;
  //   }

  //   // fixme still has cross origin issue
  //   const resp = await axios.get(
  //     'https://github.com/baendlorel/baendlorel.github.io/releases/download/assets/fetched-data.json'
  //   );
  //   resp.data.forEach((repo: RepoInfo) => {
  //     repo.is_npm_package = !!repo.npm;
  //   });
  //   return resp.data;
  // }
  async getInfo(): Promise<RepoInfo[]> {
    const script = document.createElement('script');
    script.id = 'CORS_GET_REPO_INFO';
    script.type = 'text/javascript';
    script.src =
      'https://github.com/baendlorel/baendlorel.github.io/releases/download/assets/fetched-data.js';
    document.body.appendChild(script);
    const result = await new Promise<RepoInfo[]>((resolve) =>
      Reflect.set(globalThis, 'CORS_GET_REPO_INFO_RESOLVER', resolve)
    );
    script.remove();
    return result;
  }
}

const repositoryService = new RepositoryService();
export default repositoryService;
