const { wrapExecCmd } = require("../util/wrapExecCmd");

const { createUser } = require("../aws/createUser");
const { createAccessKey } = require("../aws/createAccessKey");
const { attachUserPolicy } = require("../aws/attachUserPolicy");
const { createDynamoTable } = require("../aws/createDynamoTable");
const { inRootDirectory } = require('../util/fs');
const { getRepoInfo } = require('../constants');
const { getGithubSecrets } = require('../services/githubService');

const {
  addGithubSecrets,
  checkBubbleAwsSecretsAdded,
  checkNonBubbleAwsSecretsAdded
} = require("../util/manageGithubSecrets");

const { getGitHubToken } = require('../util/deleteApps');

const {
  modifyConfig,
  modifyCredentials,
} = require('../util/modifyAwsProfile');

const {
  createWorkflowDir,
  copyGithubActions,
  createConfigFile,
  isRepo,
  addToActiveReposFile
} = require("../util/fs");

const {
  bubbleErr,
  bubbleSuccess,
  bubbleHelp,
  bubbleGeneral,
  bubbleLoading,
  bubbleWelcome,
  bubbleIntro,
  bubbleWarn,
  bubblePunchline,
  bubbleConclusionPrimary,
  bubbleConclusionSecondary
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

const { addDashboardFolder } = require("../util/addDashboard");

const init = async () => {
  try {
    if (!isRepo()) {
      throw `${NOT_A_REPO_MSG}`;
    }

    const repoDir = await wrapExecCmd('git rev-parse --show-toplevel')
    const inRoot = await inRootDirectory();
    if (!inRoot) {
      bubbleErr(`Please run this command in the root directory of your repo, which should be ${repoDir}`);
      return;
    }

    const { repo } = await getRepoInfo();

    if (await existingAwsUser()) {
      bubbleWarn(`${duplicateBubbleInit(repo)}`);
      return;
    }

    bubbleWelcome(WELCOME_MSG);
    bubbleHelp(PREREQ_MSG);

    await createConfigFile();
    addToActiveReposFile(repo);
    await addDashboardFolder();

    const currentSecrets = await getGithubSecrets();
    const nonBubbleAwsSecretsAlreadyAdded = checkNonBubbleAwsSecretsAdded(currentSecrets);

    if (nonBubbleAwsSecretsAlreadyAdded) {
      bubbleWarn(NONBUBBLE_AWS_KEYS_IN_REPO_MSG);
    }

    const bubbleAwsSecretsAdded = checkBubbleAwsSecretsAdded(currentSecrets);

    if (!bubbleAwsSecretsAdded) {
      bubbleGeneral(CREATING_IAM_USER_MSG);

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
      bubbleWarn(BUBBLE_AWS_SECRETS_ALREADY_SAVED_MSG);
    }

    createWorkflowDir();
    copyGithubActions();

    bubbleIntro(WAIT_FOR_DB_MSG, 1);
    const randomDBJoke = randomJokeSetup('DB');
    let spinner;
    setTimeout(async () => {
      spinner = bubbleLoading(waitForJokeSetup(randomDBJoke), 1);
      spinner.start();
    }, 2000);
    setTimeout(async () => {
      spinner.succeed();
      bubblePunchline(waitForJokePunchline(randomDBJoke, 'DB'), 1);
    }, 7000);
    setTimeout(async () => {
      bubblePunchline(WAIT_FOR_DB_JOKE_DRUM, 1);
    }, 8000);
    setTimeout(async () => {
      bubblePunchline(waitForDBJokeCrickets(), 1);
    }, 10000);

    setTimeout(async () => {
      try {
        await wrapExecCmd(createDynamoTable(repo));
        bubbleConclusionPrimary(DB_CREATED_MSG, 1);
        bubbleConclusionSecondary(INIT_FINISHED_MSG, 1);
      } catch {
        bubbleConclusionPrimary(DB_NOT_CREATED_MSG, 1);
      }
    }, 13000);
  } catch (err) {
    bubbleErr(`Couldn't finish initializing Bubble:\n${err}`);
  }
};

module.exports = { init };
