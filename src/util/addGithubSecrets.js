const axios = require("axios");
const { readConfigFile } = require("./fs");
const {
  bubbleErr,
  bubbleSuccess,
  bubbleWarn
} = require("./logger");
const { wrapExecCmd } = require("./wrapExecCmd");
const process = require("process");

const encrypt = async (public_key, secret_val) => {
  const sodium = require("libsodium-wrappers");
  await sodium.ready;
  const key = public_key;

  const messageBytes = Buffer.from(secret_val);
  const keyBytes = Buffer.from(key, "base64");

  const encryptedBytes = sodium.crypto_box_seal(messageBytes, keyBytes);

  const encrypted = Buffer.from(encryptedBytes).toString("base64");
  return encrypted;
};

const headerObj = () => {
  const config_obj = readConfigFile();
  const github_access_token = config_obj.github_access_token;

  return (obj = {
    headers: {
      Authorization: `token ${github_access_token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json",
    },
  });
};

async function getPublicKey() {
  let remote = await wrapExecCmd("git config --get remote.origin.url");

  const parts = remote.split("/");
  const owner = parts[parts.length - 2];
  const repo = parts[parts.length - 1].slice(0, -5);

  let url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`;

  const obj = headerObj();

  let response = await axios.get(url, obj);

  return { owner, repo, response };
}

async function addGithubSecrets(secrets) {
  try {
    var { owner, repo, response } = await getPublicKey();
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
  const public_key = response.data.key;
  const key_id = response.data.key_id;

  await Object.keys(secrets).map(async (key) => {
    const secret_name = key;
    const secret_val = secrets[key];
    const encrypted_secret_val = await encrypt(public_key, secret_val);
    bubbleWarn(`${secret_name} has been encrypted.`);

    url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/${secret_name}`;
    const data = {
      encrypted_value: encrypted_secret_val,
      key_id: key_id,
    };

    const obj = headerObj();

    await axios.put(url, data, obj);
    bubbleSuccess("created", `${secret_name} secret has been:`);
  });
}

async function checkAwsSecretsCreated() {
  try {
    var { owner, repo, response } = await getPublicKey();
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
  const obj = headerObj();
  const currentSecrets = await axios.get(url, obj);

  return currentSecrets.data.secrets.some(secretObj => secretObj.name === 'AWS_ACCESS_KEY_ID');
}

async function validateGithubConnection() {
  try {
    var { owner, repo, response } = await getPublicKey();
    if (response.status !== 200) {
      throw `HTTP error! status: ${response.status}`;
    }
  } catch (e) {
    bubbleErr(
      `Couldn't connect to Github due to: ${e}.\n Please validate your access key, git remote value, remote repo permissions, bubble arguments, etc.`
    );
    process.exit();
  }
}

module.exports = { addGithubSecrets, validateGithubConnection, checkAwsSecretsCreated };
