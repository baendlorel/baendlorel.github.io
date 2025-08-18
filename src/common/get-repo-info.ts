import axios from 'axios';

export async function getRepoInfo(): Promise<RepoData[]> {
  if (__IS_DEV__) {
    const data = await import('../../cache/fetched-data.json');
    return data.default;
  }

  const resp = await axios.get(
    'https://github.com/baendlorel/baendlorel.github.io/releases/download/assets/fetched-data.json'
  );
  resp.data.forEach((repo: RepoData) => {
    repo.is_npm_package = !!repo.npm;
  });
  return resp.data;
}
