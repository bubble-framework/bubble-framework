const axios = require("axios");
const process = require("process");

const { readConfigFile } = require("./fs");
const { configPath } = require('./paths')

const {
  bubbleErr,
  bubbleSuccess,
  bubbleWarn
} = require("./logger");

const { wrapExecCmd } = require("./wrapExecCmd");

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

const encrypt = async (publicKey, secretVal) => {
  const sodium = require("libsodium-wrappers");
  await sodium.ready;
  const key = publicKey;

  const messageBytes = Buffer.from(secretVal);
  const keyBytes = Buffer.from(key, "base64");

  const encryptedBytes = sodium.crypto_box_seal(messageBytes, keyBytes);

  const encrypted = Buffer.from(encryptedBytes).toString("base64");
  return encrypted;
};

async function getRepoInfo() {
  let remote = await wrapExecCmd("git config --get remote.origin.url");

  const parts = remote.split("/");
  const owner = parts[parts.length - 2];
  const repo = parts[parts.length - 1].slice(0, -5);

  return { owner, repo };
}

async function getPublicKey() {
  const { owner, repo } = await getRepoInfo();
  let url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`;

  let response = await axios.get(url, HEADER_OBJ);
  return response;
}

async function addGithubSecrets(secrets) {
  let owner, repo, response;

  try {
    const repoInfo = await getRepoInfo();
    [owner, repo] = [repoInfo.owner, repoInfo.repo];

    response = await getPublicKey();

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (e) {
    bubbleErr(
      `Couldn't pull public key due to: ${e}. Secrets will not be populated. Please rerun bubble init.`
    );
    process.exit();
  }

  bubbleSuccess("retrieved", "Public key:");
  const publicKey = response.data.key;
  const keyId = response.data.key_id;

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
}

async function retrieveCurrentSecrets() {
  let owner, repo;

  try {
    const repoInfo = await getRepoInfo();
    [owner, repo] = [repoInfo.owner, repoInfo.repo];

    const response = await getPublicKey();
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (e) {
    bubbleErr(
      `Couldn't pull public key due to: ${e}. Secrets will not be populated. Please rerun bubble init.`
    );
    process.exit();
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets`;
  const currentSecrets = await axios.get(url, HEADER_OBJ);

  return currentSecrets;
}

function checkBubbleAwsSecretsAdded(currentSecrets) {
  const secretNames = currentSecrets.data.secrets.map(secretObj => secretObj.name);
  const bubbleSecretNames = [
    'BUBBLE_AWS_ACCESS_KEY_ID',
    'BUBBLE_AWS_SECRET_ACCESS_KEY',
  ];

  return bubbleSecretNames.every(bubbleSecretName => (
    secretNames.includes(bubbleSecretName)
  ));
}

function checkNonBubbleAwsSecretsAdded(currentSecrets) {
  const secretNames = currentSecrets.data.secrets.map(secretObj => secretObj.name);
  const awsSecretNames = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
  ]

  return awsSecretNames.every(awsSecretNames => (
    secretNames.includes(awsSecretNames)
  )) && !checkBubbleAwsSecretsAdded(currentSecrets);
}

async function validateGithubConnection() {
  try {
    const response = await getPublicKey();

    if (response.status !== 200) {
      throw `HTTP error! status: ${response.status}`;
    }
  } catch (e) {
    bubbleErr(
      `Couldn't connect to Github due to: ${e}.\n Please validate your Github token, git remote value, remote repo permissions, Bubble arguments.`
    );

    process.exit();
  }
}

module.exports = {
  getRepoInfo,
  getPublicKey,
  addGithubSecrets,
  validateGithubConnection,
  retrieveCurrentSecrets,
  checkBubbleAwsSecretsAdded,
  checkNonBubbleAwsSecretsAdded
};

