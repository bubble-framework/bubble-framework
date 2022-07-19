import wrapExecCmd from './util/wrapExecCmd.js';
import { readConfigFile } from './util/fs.js';
import { configPath } from './util/paths.js';

export async function getRepoInfo() {
  const nameWithOwner = await wrapExecCmd(
    'git config --get remote.origin.url'
  );

  const parts = nameWithOwner.split('/');
  const owner = parts[parts.length - 2];
  const repo = parts[parts.length - 1].split('.')[0];

  return { owner, repo };
}

export const GH_HEADER_OBJ = (() => {
  const configObj = readConfigFile(configPath, 'JSON');
  const githubAccessToken = configObj.github_access_token;

  return {
    headers: {
      Authorization: `token ${githubAccessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
  };
})();
