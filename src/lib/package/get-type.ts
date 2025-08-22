const REPO_PURPOSES = ['npm', 'rollup-plugin', 'vscode-extension', 'app'];

export function getType(repo: RepoInfo): string | null {
  if (REPO_PURPOSES.includes(repo.purpose)) {
    return repo.purpose;
  }
  // if (repo.topics.includes('library')) {
  //   return 'fas fa-book';
  // }
  // if (repo.topics.includes('tool')) {
  //   return 'fas fa-tools';
  // }
  return null;
}
