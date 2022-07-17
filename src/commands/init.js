const { wrapExecCmd } = require("../util/wrapExecCmd");

const { createUser } = require("../aws/createUser");
const { createAccessKey } = require("../aws/createAccessKey");
const { attachUserPolicy } = require("../aws/attachUserPolicy");
const { createDynamoTable } = require("../aws/createDynamoTable");
const { getRepoInfo } = require('../util/addGithubSecrets');

const {
  addGithubSecrets,
  validateGithubConnection,
  retrieveCurrentSecrets,
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

const {
  NOT_A_REPO_MSG,
  WELCOME_MSG,
  PREREQ_MSG,
  NONBUBBLE_AWS_KEYS_IN_REPO_MSG,
  CREATING_IAM_USER_MSG,
  BUBBLE_AWS_SECRETS_ALREADY_SAVED_MSG,
  INIT_FINISHED_MSG,
  WAIT_FOR_DB_MSG,
  WAIT_FOR_DB_JOKE_DRUM,
  DB_CREATED_MSG,
  DB_NOT_CREATED_MSG,
  randomJokeSetup,
  waitForJokeSetup,
  waitForJokePunchline,
  waitForDBJokeCrickets,
  duplicateBubbleInit
} = require("../util/messages");

const { existingAwsUser } = require("../util/deleteUser");

const { userPolicyPath } = require("../util/paths");

const init = async (args) => {
  try {
    if (!isRepo()) {
      throw `${NOT_A_REPO_MSG}`;
    }

    const { repo } = await getRepoInfo();

    if (await existingAwsUser()) {
      bubbleBold(`${duplicateBubbleInit(repo)}`);
      return;
    }

    bubbleBold(WELCOME_MSG);
    bubbleHelp(PREREQ_MSG);

    await createConfigFile();
    await validateGithubConnection();

    const currentSecrets = await retrieveCurrentSecrets();
    const nonBubbleAwsSecretsAlreadyAdded = checkNonBubbleAwsSecretsAdded(currentSecrets);

    if (nonBubbleAwsSecretsAlreadyAdded) {
      bubbleWarn(NONBUBBLE_AWS_KEYS_IN_REPO_MSG);
    }

    const bubbleAwsSecretsAdded = checkBubbleAwsSecretsAdded(currentSecrets);

    if (!bubbleAwsSecretsAdded) {
      bubbleBold(CREATING_IAM_USER_MSG);

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
      bubbleBold(BUBBLE_AWS_SECRETS_ALREADY_SAVED_MSG);
    }

    createWorkflowDir();
    copyGithubActions();

    bubbleBold(WAIT_FOR_DB_MSG);
    const randomDBJoke = randomJokeSetup('DB');
    setTimeout(async () => {
      bubbleBold(waitForJokeSetup(randomDBJoke));
    }, 2000);
    setTimeout(async () => {
      bubbleBold(waitForJokePunchline(randomDBJoke, 'DB'));
    }, 7000);
    setTimeout(async () => {
      bubbleBold(WAIT_FOR_DB_JOKE_DRUM);
    }, 8000);
    setTimeout(async () => {
      bubbleBold(waitForDBJokeCrickets());
    }, 10000);


    setTimeout(async () => {
      try {
        await wrapExecCmd(createDynamoTable(repo));
        bubbleBold(DB_CREATED_MSG);
        bubbleBold(INIT_FINISHED_MSG);
      } catch {
        bubbleBold(DB_NOT_CREATED_MSG);
      }
    }, 13000);
  } catch (err) {
    bubbleErr(`Couldn't finish initializing Bubble:\n${err}`);
  }
};

module.exports = { init };
