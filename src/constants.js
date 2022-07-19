import wrapExecCmd from './util/wrapExecCmd.js';
import { readConfigFile } from './util/fs.js';
import { configPath } from './util/paths.js';

const getRepoInfo = async () => {
  const nameWithOwner = await wrapExecCmd(
    'gh repo view --json nameWithOwner -q \'.nameWithOwner\'',
  );

  // eslint-disable-next-line array-bracket-spacing
  const [owner, repo] = nameWithOwner
    .trim()
    .split('/');

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
