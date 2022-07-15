const { readConfigFile } = require("./fs");
const { configPath } = require('./paths');

const { repoInfo } = require('../constants');
const { owner, repo } = repoInfo;

const { encrypt } = require('../util/encrypt');

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
  let url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`;

  let response = await axios.get(url, HEADER_OBJ);
  return response;
}

async function addSecret(secretName, secretVal, publicKeyObj) {
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

/*
await Object.keys(secrets).map(async (key) => {
    const secretName = key;
    const secretVal = secrets[key];
    const encryptedSecretVal = await encrypt(publicKey, secretVal);
    bubbleWarn(`${secretName} has been encrypted.`);

    url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/${secretName}`;
    const data = {
      encrypted_value: encryptedSecretVal,
      key_id: keyId,
    };

    await axios.put(url, data, HEADER_OBJ);
    bubbleSuccess("created", `${secretName} secret has been:`);
  });
*/

/*
secrets = {
  BUBBLE_SECRET_NAME: "gnwligh23850",
}

*/

module.exports = {
  getPublicKey,
  addSecret,
}