const REPO_PURPOSES = [
  'npm',
  'plugin',
  'rollup-plugin',
  'extension',
  'vscode-extension',
  'app',
  'other',
] as const;

const what: IsSameType<(typeof REPO_PURPOSES)[number], RepoPurpose> = true;

export const getType = (repo: RepoInfo): string | null => {
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
};

export const repoFilter = (filter: RepoFilter) => (repo: RepoInfo) => {
  switch (repo.purpose) {
    case 'npm':
      return filter === 'npm';
    case 'app':
      return filter === 'app';
    case 'extension':
    case 'vscode-extension':
      return filter === 'extension';
    case 'plugin':
    case 'rollup-plugin':
      return filter === 'plugin';
    case 'other':
      return filter === 'other';
    default:
      const _: never = repo.purpose;
      return true;
  }
};
