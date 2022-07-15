const prompts = require("prompts");
const { wrapExecCmd } = require("../util/wrapExecCmd");

const { createUser } = require("../aws/createUser");
const { createAccessKey } = require("../aws/createAccessKey");
const { attachUserPolicy } = require("../aws/attachUserPolicy");
const { createDynamoTable } = require("../aws/createDynamoTable");

const { getGithubSecrets } = require('../services/githubService');

const {
  addGithubSecrets,
  checkBubbleAwsSecretsAdded,
  checkNonBubbleAwsSecretsAdded
} = require("../util/addGithubSecrets");

const { getGitHubToken } = require('../util/deleteApps');

const {
  modifyConfig,
  modifyCredentials,
} = require('../util/modifyAwsProfile');

const {
  createWorkflowDir,
  copyGithubActions,
  createConfigFile,
  isRepo
} = require("../util/fs");

const {
  bubbleErr,
  bubbleSuccess,
  bubbleWarn,
  bubbleBold,
  bubbleHelp
} = require("../util/logger");

const { repoInfo } = require('../constants');
const { userPolicyPath } = require("../util/paths");

const init = async (args) => {
  try {
    if (!isRepo()) {
      throw `Current directory is not a git repository or it is not tied to a GitHub Origin`;
    }

    bubbleBold('Welcome to the Bubble CLI!\n');
    bubbleHelp('Before we get started, please make sure you have your AWS credentials configured with AWS CLI.\n');

    await createConfigFile();

    const currentSecrets = await getGithubSecrets();
    const nonBubbleAwsSecretsAlreadyAdded = checkNonBubbleAwsSecretsAdded(currentSecrets);

    if (nonBubbleAwsSecretsAlreadyAdded) {
      bubbleWarn("Looks like you already have AWS credentials saved in your Github repository! Not to worry, those can stay safe and sound where they are, but to provision your preview apps, we will create a new IAM user with the proper permissions. The credentials for this new user will be saved in your Github repository prepended with 'BUBBLE'.\n");
    }

    const bubbleAwsSecretsAdded = checkBubbleAwsSecretsAdded(currentSecrets);
    const { repo } = repoInfo();

    if (!bubbleAwsSecretsAdded) {
      bubbleBold('Creating AWS IAM User credentials and saving in your Github repository...\n');

      await wrapExecCmd(createUser(repo));

      bubbleSuccess("created", "IAM User: ");

      const accessKeyInfo = await wrapExecCmd(createAccessKey(repo));
      bubbleSuccess("created", "IAM User Access Key: ");
      const accessKeyInfoObj = JSON.parse(accessKeyInfo);
      const accessKeyId = accessKeyInfoObj["AccessKey"]["AccessKeyId"];
      const secretKey = accessKeyInfoObj["AccessKey"]["SecretAccessKey"];

      modifyConfig(repo);
      modifyCredentials(accessKeyId, secretKey, repo);
      bubbleSuccess("created", "AWS Command Line Profile: ")

      await wrapExecCmd(attachUserPolicy(userPolicyPath, repo));
      bubbleSuccess("saved", "IAM User Restrictions: ");

      const token = getGitHubToken();

      const secrets = {
        "BUBBLE_AWS_ACCESS_KEY_ID": accessKeyId,
        "BUBBLE_AWS_SECRET_ACCESS_KEY": secretKey,
        "BUBBLE_GITHUB_TOKEN": token,
      };

      await addGithubSecrets(secrets);
    } else {
      bubbleSuccess("already created and saved", "AWS IAM User, Access Keys and Github Token: ");
    }

    createWorkflowDir();
    copyGithubActions();

    setTimeout(async () => {
      await wrapExecCmd(createDynamoTable(repo));
      bubbleSuccess("created", "Dynamo table created:");
    }, 13000);
  } catch (err) {
    bubbleErr(`Could not initialize app:\n${err}`);
  }
};

module.exports = { init };
