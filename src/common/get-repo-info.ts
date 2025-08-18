import axios from 'axios';

export async function getRepoInfo(): Promise<RepoData[]> {
  const url = __IS_DEV__
    ? '/api/data'
    : 'https://github.com/baendlorel/baendlorel.github.io/releases/download/assets/fetched-data.json';
  console.log('__IS_DEV__', __IS_DEV__, url);

  const repos = await axios.get(url);
  repos.data.forEach((repo: RepoData, index: number) => {
    repo.index = index;
    repo.is_npm_package = !!repo.npm;
  });
  return repos.data;
}
