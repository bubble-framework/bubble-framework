import { wrapExecCmd } from './util/wrapExecCmd';
import { readConfigFile } from './util/fs';
import { configPath } from './util/paths';

export async function getRepoInfo() {
  let nameWithOwner = await wrapExecCmd(
    "gh repo view --json nameWithOwner -q '.nameWithOwner'"
  );

  const [ owner, repo ] = nameWithOwner
    .trim()
    .split('/');
  
  return { owner, repo };
};

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

// export default { getRepoInfo, GH_HEADER_OBJ };
