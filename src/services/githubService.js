import axios from 'axios';

import encrypt from '../util/encrypt.js';

import {
  bubbleErr,
  bubbleSuccess,
  bubbleWarn,
  bubbleSecrets,
} from '../util/logger.js';

import { GITHUB_CONNECTION_FAILURE_MSG } from '../util/messages.js';

import { getRepoInfo, GH_HEADER_OBJ } from '../constants.js';

export const getPublicKey = async () => {
  const { owner, repo } = await getRepoInfo();

  const url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`;

  try {
    const response = await axios.get(url, GH_HEADER_OBJ);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (e) {
    bubbleErr(`Couldn't connect to Github due to: ${e}.\n`);
    bubbleWarn(GITHUB_CONNECTION_FAILURE_MSG);
    return process.exit();
  }
};

export const addGithubSecret = async (secretName, secretVal, publicKeyObj) => {
  const { owner, repo } = await getRepoInfo();

  const { key: publicKey, key_id: keyId } = publicKeyObj;
  const encryptedSecretVal = await encrypt(publicKey, secretVal);
  bubbleSecrets(`${secretName} has been encrypted.`);

  const url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/${secretName}`;

  const data = {
    encrypted_value: encryptedSecretVal,
    key_id: keyId,
  };

  await axios.put(url, data, GH_HEADER_OBJ);
  bubbleSuccess('created', `${secretName} secret has been:`);
};

export const getGithubSecrets = async () => {
  const { owner, repo } = await getRepoInfo();

  const url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets`;

  try {
    const secrets = await axios.get(url, GH_HEADER_OBJ);
    return secrets;
  } catch (e) {
    bubbleErr(`Couldn't connect to Github due to: ${e}.\n`);
    bubbleWarn(GITHUB_CONNECTION_FAILURE_MSG);

    return process.exit();
  }
};
