import axios from 'axios';

import awsService from '../services/awsService.js';
import wrapExecCmd from './wrapExecCmd.js';
import { getRepoInfo, GH_HEADER_OBJ } from '../constants.js';
import { readConfigFile } from './fs.js';
import { configPath } from './paths.js';

import { bubbleErr, bubbleWarn } from './logger.js';

const DELETE_ALL_WORKFLOW_FILE = 'bubble_remove_all_preview_apps.yml';

const getAppsDetails = async (repoName) => {
  const rawAppsDetails = await wrapExecCmd(awsService.getPreviewAppsDetails(repoName));

  return JSON.parse(rawAppsDetails).Items;
};

const getActivePullRequestIdsString = (appsData) => {
  const activePullRequests = appsData.reduce((memo, pullRequest) => {
    if (pullRequest.IsActive.BOOL === true) {
      memo.push(pullRequest.PullRequestId.N);
    }

    return memo;
  }, []);

  return activePullRequests.join(' ');
};

export const getGitHubToken = () => {
  const configObj = readConfigFile(configPath, 'JSON');

  return configObj.github_access_token;
};

const triggerRemoteRepoAppsTeardown = async ({ owner, repo, pullRequestIds }) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${DELETE_ALL_WORKFLOW_FILE}/dispatches`;

  const body = {
    ref: 'main',
    inputs: {
      'pr-numbers': pullRequestIds,
    },
  };

  try {
    await axios.post(url, body, GH_HEADER_OBJ);
  } catch (e) {
    if (e.response.status === 422 && e.response.data.message.includes('pr-numbers')) {
      bubbleWarn('Looks like there are no preview apps to be deleted for this repository!');
    } else {
      bubbleErr(`Remote Preview Apps Teardown Failed ${e}`);
    }
  }
};

export const deleteApps = async () => {
  const { owner, repo } = await getRepoInfo();
  const appsDetails = await getAppsDetails(repo);

  const activePullRequestIds = getActivePullRequestIdsString(appsDetails);
  await triggerRemoteRepoAppsTeardown({ owner, repo, pullRequestIds: activePullRequestIds });
};
