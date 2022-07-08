const prompts = require("prompts");
const axios = require("axios");
const { wrapExecCmd } = require("../util/wrapExecCmd");

const { createUser } = require("../aws/createUser");
const { createAccessKey } = require("../aws/createAccessKey");
const { attachUserPolicy } = require("../aws/attachUserPolicy");

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
      await wrapExecCmd(createUser());
      bubbleSuccess("created", "IAM User: ");

      const accessKeyInfo = await wrapExecCmd(createAccessKey());
      bubbleSuccess("created", "IAM User Access Key: ");
      const accessKeyInfoObj = JSON.parse(accessKeyInfo);
      const accessKeyId = accessKeyInfoObj["AccessKey"]["AccessKeyId"];
      const secretKey = accessKeyInfoObj["AccessKey"]["SecretAccessKey"];

      const attachPolicyCmd = attachUserPolicy(userPolicyPath);
      await wrapExecCmd(attachPolicyCmd);
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
  } catch (err) {
    bubbleErr(`Could not initialize app:\n${err}`);
  }
};

// init();

module.exports = { init };