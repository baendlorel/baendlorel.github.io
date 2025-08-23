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
  return 'other';
};

export const repoFilter = (filter: RepoFilter) => (repo: RepoInfo) => {
  switch (repo.purpose) {
    case 'npm':
      return filter === 'npm';
    case 'app':
      return filter === 'app';
    case 'vscode-extension':
      return filter === 'extension';
    case 'extension':
      return filter === 'extension';
    case 'rollup-plugin':
      return filter === 'plugin' || filter === 'npm';
    case 'plugin':
      return filter === 'plugin';
    case 'other':
      return filter === 'other';
    default:
      const _: never = repo.purpose;
      return filter === 'other';
  }
};

export const getNpmState = (repo: RepoInfo) => {
  if (repo.purpose === 'npm' || repo.purpose === 'rollup-plugin') {
    return repo.npm ? 'available' : 'unavailable';
  } else {
    return 'na';
  }
};
