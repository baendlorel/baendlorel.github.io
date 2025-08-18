export async function getRepoInfo(): Promise<RepoData[]> {
  const url =
    'https://github.com/baendlorel/baendlorel.github.io/releases/download/assets/fetched-data.json';
  const repos = await fetch(url).then((res) => res.json());
  repos.forEach((repo: RepoData, index: number) => {
    repo.index = index;
    repo.is_npm_package = !!repo.npm;
  });
  return repos;
}
