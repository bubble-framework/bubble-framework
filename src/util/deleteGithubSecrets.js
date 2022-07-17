const axios = require("axios");
const { readConfigFile } = require("./fs");
const { configPath } = require('./paths')

const {
  bubbleErr,
  bubbleSuccess,
  bubbleWarn
} = require("./logger");
const { wrapExecCmd } = require("./wrapExecCmd");

async function deleteGithubSecrets() {
  const currentPath = process.cwd();
  const cmd = `git config --get remote.origin.url`;
  wrapExecCmd(cmd, 'Could not remove secrets')
    .then(async (remote) => {

      wrapExecCmd(`cd ${currentPath}`);

      const parts = remote.split("/");
      const owner = parts[parts.length - 2];
      const repo = parts[parts.length - 1].slice(0, -5);
      const config_obj = readConfigFile(configPath, "JSON");
      const github_access_token = config_obj.github_access_token;

      let url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`;

      const obj = {
        headers: {
          Authorization: `token ${github_access_token}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
        },
      };

      // request is made to get public key
      let response = await axios.get(url, obj);
      bubbleSuccess("retrieved", "Public key:");
      const public_key = response.data.key;
      const key_id = response.data.key_id;

      const secrets = [
        "BUBBLE_AWS_ACCESS_KEY_ID",
        "BUBBLE_AWS_SECRET_ACCESS_KEY",
        "BUBBLE_GITHUB_TOKEN",
      ];

      secrets.forEach((secret_name) => {
        url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets/${secret_name}`;

        bubbleWarn(`Removing ${secret_name} secret from your Github repository...`);
        axios.delete(url, obj).then(_ => {
          bubbleSuccess("removed", `${secret_name} secret has been:`);
        }).catch(err => bubbleErr(`Oops! Could not remove ${secret_name}. Try re-running \`bubble teardown\` and double check your Github repository if you'd like to ensure all secrets prepended with \`BUBBLE\` have been removed.`));
      });
    }).catch(err => bubbleErr(err));
}

module.exports = { deleteGithubSecrets };