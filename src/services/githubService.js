import axios from 'axios';

import { readConfigFile } from '../util/fs';
import { encrypt } from '../util/encrypt';
import { configPath } from '../util/paths';

import {
  bubbleErr,
  bubbleSuccess,
  bubbleWarn,
  bubbleSecrets,
} from '../util/logger';

import { GITHUB_CONNECTION_FAILURE_MSG } from '../util/messages';

import { getRepoInfo } from '../constants';

const HEADER_OBJ = (() => {
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

async function getPublicKey() {
  const { owner, repo } = await getRepoInfo();

  const url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`;

  try {
    const response = await axios.get(url, HEADER_OBJ);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (e) {
    bubbleErr(`Couldn't connect to Github due to: ${e}.\n`);
    bubbleWarn(GITHUB_CONNECTION_FAILURE_MSG);
    return process.exit();
  }
}

async function addGithubSecret(secretName, secretVal, publicKeyObj) {
  const { owner, repo } = await getRepoInfo();

  const { key: publicKey, key_id: keyId } = publicKeyObj;
  const encryptedSecretVal = await encrypt(publicKey, secretVal);
  bubbleSecrets(`${secretName} has been encrypted.`);

  const url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/${secretName}`;

  const data = {
    encrypted_value: encryptedSecretVal,
    key_id: keyId,
  };

  await axios.put(url, data, HEADER_OBJ);
  bubbleSuccess('created', `${secretName} secret has been:`);
}

async function getGithubSecrets() {
  const { owner, repo } = await getRepoInfo();

  const url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets`;
  const secrets = await axios.get(url, HEADER_OBJ);

  return secrets;
}

export default {
  getPublicKey,
  addGithubSecret,
  getGithubSecrets,
};
