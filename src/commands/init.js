const prompts = require("prompts");
const axios = require("axios");
const { wrapExecCmd } = require("../util/wrapExecCmd");

const { createUser } = require("../aws/createUser");
const { createAccessKey } = require("../aws/createAccessKey");
const { attachUserPolicy } = require("../aws/attachUserPolicy");
const { createDynamoTable } = require("../aws/createDynamoTable");
const { getPublicKey } = require('../util/addGithubSecrets')

const {
  addGithubSecrets,
  validateGithubConnection,
  checkAwsSecretsCreated
} = require("../util/addGithubSecrets");

const {
  createWorkflowDir,
  copyGithubActions,
  createConfigFile,
  isRepo
} = require("../util/fs");

const {
  bubbleErr,
  bubbleSuccess
} = require("../util/logger");

const { userPolicyPath } = require("../util/paths");

const init = async (args) => {
  try {
    if (!isRepo()) {
      throw `Current directory is not a git repository or it is not tied to a GitHub Origin`;
    }

    await createConfigFile();
    await validateGithubConnection();


    const awsSecretsCreated = await checkAwsSecretsCreated();

    if (!awsSecretsCreated) {
      const { repo } = await getPublicKey();

      await wrapExecCmd(createUser(repo));

      bubbleSuccess("created", "IAM User: ");

      const accessKeyInfo = await wrapExecCmd(createAccessKey(repo));
      bubbleSuccess("created", "IAM User Access Key: ");
      const accessKeyInfoObj = JSON.parse(accessKeyInfo);
      const accessKeyId = accessKeyInfoObj["AccessKey"]["AccessKeyId"];
      const secretKey = accessKeyInfoObj["AccessKey"]["SecretAccessKey"];

      await wrapExecCmd(attachUserPolicy(userPolicyPath, repo));
      bubbleSuccess("saved", "IAM User Restrictions: ");

      const secrets = {
        "AWS_ACCESS_KEY_ID": accessKeyId,
        "AWS_SECRET_ACCESS_KEY": secretKey
      };

      addGithubSecrets(secrets);
    } else {
      bubbleSuccess("already created", "AWS IAM User and Access Keys: ");
    }

    createWorkflowDir();
    copyGithubActions();

    let remote = await wrapExecCmd("git config --get remote.origin.url");

    const parts = remote.split("/");
    const repo = parts[parts.length - 1].slice(0, -5);

    await wrapExecCmd(createDynamoTable(`${repo}`));
  } catch (err) {
    bubbleErr(`Could not initialize app:\n${err}`);
  }
};

// init();

module.exports = { init };