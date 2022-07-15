const axios = require('axios');

const { readConfigFile } = require("../util/fs");
const { encrypt } = require('../util/encrypt');

const {
  bubbleErr,
  bubbleSuccess,
  bubbleWarn,
} = require("../util/logger");

const { configPath } = require('../util/paths');
const { getRepoInfo } = require('../constants');
const { owner, repo } = await getRepoInfo;

const HEADER_OBJ = (() => {
  const configObj = readConfigFile(configPath, "JSON");
  const githubAccessToken = configObj.github_access_token;

  return (obj = {
    headers: {
      Authorization: `token ${githubAccessToken}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json",
    },
  });
})();

async function getPublicKey() {
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`;

  try {
    const response = await axios.get(url, HEADER_OBJ);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (e) {
    bubbleErr(
      `Couldn't connect to Github due to: ${e}.\n Please validate your Github token, git remote value, remote repo permissions, Bubble arguments.`
    );
    
    process.exit();
  }
}

async function addGithubSecret(secretName, secretVal, publicKeyObj) {
  const { publicKey, keyId } = publicKeyObj;
  const encryptedSecretVal = await encrypt(publicKey, secretVal);
  bubbleWarn(`${secretName} has been encrypted.`);

  const url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/${secretName}`;
  
  const data = {
    encrypted_value: encryptedSecretVal,
    key_id: keyId,
  };

  await axios.put(url, data, HEADER_OBJ);
  bubbleSuccess("created", `${secretName} secret has been:`);
}

async function getGithubSecrets() {
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets`;
  const secrets = await axios.get(url, HEADER_OBJ);

  return secrets;
}

module.exports = {
  getPublicKey,
  addGithubSecret,
  getGithubSecrets,
}