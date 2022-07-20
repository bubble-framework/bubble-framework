import wrapExecCmd from '../util/wrapExecCmd.js';
import { getGitHubToken } from '../util/deleteApps.js';
import { modifyConfig, modifyCredentials } from '../util/modifyAwsProfile.js';
import { existingAwsUser } from '../util/deleteUser.js';
import { userPolicyPath } from '../util/paths.js';

import {
  addGithubSecrets,
  checkBubbleAwsSecretsAdded,
  checkNonBubbleAwsSecretsAdded,
} from '../util/manageGithubSecrets.js';

import awsService from '../services/awsService.js';

import {
  inRootDirectory,
  createWorkflowDir,
  copyGithubActions,
  createConfigFile,
  isRepo,
  addToActiveReposFile,
} from '../util/fs.js';

import { getRepoInfo } from '../constants.js';
import { getGithubSecrets } from '../services/githubService.js';

import {
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
  bubbleConclusionSecondary,
} from '../util/logger.js';

import {
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
  duplicateBubbleInit,
} from '../util/messages.js';

const { addDashboardFolder } = require('../util/addDashboard').default;

const init = async () => {
  try {
    if (!isRepo()) {
      throw new Error(`${NOT_A_REPO_MSG}`);
    }

    const repoDir = await wrapExecCmd('git rev-parse --show-toplevel');
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

      await wrapExecCmd(awsService.createUser(repo));

      bubbleSuccess('created', 'IAM User: ');

      const accessKeyInfo = await wrapExecCmd(awsService.createAccessKey(repo));
      bubbleSuccess('created', 'IAM User Access Key: ');
      const accessKeyInfoObj = JSON.parse(accessKeyInfo);
      const accessKeyId = accessKeyInfoObj.AccessKey.AccessKeyId;
      const secretKey = accessKeyInfoObj.AccessKey.SecretAccessKey;

      modifyConfig(repo);
      modifyCredentials(accessKeyId, secretKey, repo);
      bubbleSuccess('created', 'AWS Command Line Profile: ');

      await wrapExecCmd(awsService.attachUserPolicy(userPolicyPath, repo));
      bubbleSuccess('saved', 'IAM User Restrictions: ');

      const token = getGitHubToken();

      const secrets = {
        BUBBLE_AWS_ACCESS_KEY_ID: accessKeyId,
        BUBBLE_AWS_SECRET_ACCESS_KEY: secretKey,
        BUBBLE_GITHUB_TOKEN: token,
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
        await wrapExecCmd(awsService.createDynamoTable(repo));
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

export default init;
