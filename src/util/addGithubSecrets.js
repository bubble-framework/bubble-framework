const axios = require("axios");
const process = require("process");

const { repoInfo } = require('../constants');
const { owner, repo } = repoInfo;

const { getPublicKey, addSecret } = require('../services/githubService');

const {
  bubbleErr,
  bubbleSuccess,
  bubbleWarn
} = require("./logger");

async function addGithubSecrets(secrets) {
  let response;

  try {
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
  const publicKeyObj = response.data;

  Object.keys(secrets).forEach(async secretName => {
    const secretVal = secrets[secretName];
    await addSecret(secretName, secretVal, publicKeyObj);
  });
}

async function retrieveCurrentSecrets() {
  try {
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
  getPublicKey,
  addGithubSecrets,
  validateGithubConnection,
  retrieveCurrentSecrets,
  checkBubbleAwsSecretsAdded,
  checkNonBubbleAwsSecretsAdded
};

