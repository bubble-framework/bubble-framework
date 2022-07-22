import fs from 'fs';
import fsAsync from 'fs/promises';
import prompts from 'prompts';

import wrapExecCmd from './wrapExecCmd.js';

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
  activeReposPath,
  gitPath,
} from './paths.js';

import { getLocalRepoDirectory } from '../services/githubService.js';
import { bubbleSuccess, bubbleWarn } from './logger.js';

import { GITHUB_PAT_MSG, REUSE_GH_PAT_MSG, FOLDER_ALREADY_DELETED } from './messages.js';

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
    await fsAsync.rm('./.github', { recursive: true });
    bubbleSuccess('deleted', ' Workflow folder:');
  } catch (e) {
    bubbleWarn(FOLDER_ALREADY_DELETED);
  }
};

const inRootDirectory = async () => {
  const repoDirectory = await getLocalRepoDirectory();
  const currentDirectory = process.cwd();

  return repoDirectory.trim() === currentDirectory.trim();
};

const activeReposWithoutCurrent = (activeRepos, currentRepoName) => (
  activeRepos.filter(({ repoName }) => repoName !== currentRepoName)
);

const addToActiveReposFile = (repoName) => {
  let activeRepos = [];
  if (fs.existsSync(activeReposPath)) {
    activeRepos = readConfigFile(activeReposPath, 'JSON');
  }
  activeRepos = activeReposWithoutCurrent(activeRepos, repoName);
  const currentPath = process.cwd();
  activeRepos.push({ repoName, status: 'active', filePath: currentPath });
  writeToConfigFile(activeRepos, activeReposPath, 'JSON');
  bubbleSuccess(`saved in ${activeReposPath}`, `Repo name ${repoName}: `);
};

const updateStatusToDestroyedInActiveReposFile = (currentRepoName) => {
  let activeRepos = readConfigFile(activeReposPath, 'JSON');

  activeRepos = activeRepos.map((repo) => (
    repo.repoName === currentRepoName ? { ...repo, status: 'destroyed' } : repo
  ));

  writeToConfigFile(activeRepos, activeReposPath, 'JSON');
  bubbleSuccess(`updated in ${activeReposPath}`, `Repo ${currentRepoName} status: `);
};

const removeFromActiveReposFile = (repoName) => {
  let activeRepos = readConfigFile(activeReposPath, 'JSON');
  activeRepos = activeReposWithoutCurrent(activeRepos, repoName);
  writeToConfigFile(activeRepos, activeReposPath, 'JSON');
  bubbleSuccess(`removed from ${activeReposPath}`, `Repo name ${repoName}: `);
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
  addToActiveReposFile,
  updateStatusToDestroyedInActiveReposFile,
  removeFromActiveReposFile,
};
