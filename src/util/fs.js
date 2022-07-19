import fs from 'fs/promises';
import prompts from 'prompts';

import wrapExecCmd from './wrapExecCmd';

import {
  githubFolderPath,
  workflowFolderPath,
  userDeployReviewAppPath,
  userHandleFailedAppPath,
  userRemoveAppPath,
  frameworkRemoveAppPath,
  userRemovePRAppsPath,
  frameworkRemovePRAppsPath,
  frameworkDeployReviewAppPath,
  frameworkHandleFailedAppPath,
  userDestroy,
  frameworkDestroy,
  dataFolderPath,
  configPath,
  gitPath,
} from './paths';

import { bubbleSuccess, bubbleWarn } from './logger';

import { GITHUB_PAT_MSG, REUSE_GH_PAT_MSG, FOLDER_ALREADY_DELETED } from './messages';

const createFolder = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    bubbleSuccess(path, 'Bubble folder created: ');
  }
};

const createWorkflowDir = () => {
  createFolder(githubFolderPath);
  createFolder(workflowFolderPath);
};

const copyGithubActions = () => {
  fs.copyFileSync(frameworkDeployReviewAppPath, userDeployReviewAppPath);

  bubbleSuccess('created', 'Create preview app Github action: ');

  fs.copyFileSync(frameworkHandleFailedAppPath, userHandleFailedAppPath);

  bubbleSuccess('created', 'Handle failed preview app deployment Github action: ');

  fs.copyFileSync(frameworkRemoveAppPath, userRemoveAppPath);

  bubbleSuccess('created', 'Remove single preview app Github action: ');

  fs.copyFileSync(frameworkRemovePRAppsPath, userRemovePRAppsPath);

  bubbleSuccess('created', 'Remove all preview apps for pull request Github action: ');

  fs.copyFileSync(frameworkDestroy, userDestroy);

  bubbleSuccess('created', 'Remove all preview apps for all pull requests in repo Github action: ');
};

const readConfigFile = (path, output) => {
  const rawUserAppsConfig = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });

  switch (output) {
  case 'JSON':
    return JSON.parse(rawUserAppsConfig);
  default:
    return rawUserAppsConfig;
  }
};

const writeToConfigFile = (config, path, output) => {
  switch (output) {
  case 'JSON':
    fs.writeFileSync(path, JSON.stringify(config));
    break;
  default:
    fs.writeFileSync(path, config);
    break;
  }
};

const addToken = async () => {
  const question = {
    type: 'text',
    name: 'githubToken',
    message: GITHUB_PAT_MSG,
  };

  const result = await prompts(question);

  writeToConfigFile({ github_access_token: result.githubToken }, configPath, 'JSON');
  bubbleSuccess(`saved in ${configPath}`, 'Bubble configuration: ');
};

const createConfigFile = async () => {
  createFolder(dataFolderPath);

  if (!fs.existsSync(configPath)) {
    await addToken();
  } else {
    const question = {
      type: 'confirm',
      name: 'useToken',
      message: REUSE_GH_PAT_MSG,
      initial: true,
    };

    const result = await prompts(question);

    if (!result.useToken) {
      await addToken();
    }
  }
};

const isRepo = async () => {
  if (!fs.existsSync(gitPath)) return false;
  const url = await wrapExecCmd('git config --get remote.origin.url');
  return !!url;
};

const deleteWorkflowFolder = async () => {
  try {
    await fs.rm('./.github', { recursive: true });
    bubbleSuccess('deleted', ' Workflow folder:');
  } catch (e) {
    bubbleWarn(FOLDER_ALREADY_DELETED);
  }
};

const inRootDirectory = async () => {
  const repoDirectory = await wrapExecCmd('git rev-parse --show-toplevel');
  const currentDirectory = process.cwd();
  return repoDirectory === currentDirectory;
};

export {
  createWorkflowDir,
  copyGithubActions,
  addToken,
  createConfigFile,
  readConfigFile,
  writeToConfigFile,
  isRepo,
  deleteWorkflowFolder,
  inRootDirectory,
};
