import axios from 'axios';

import awsService from '../services/awsService';
import wrapExecCmd from './wrapExecCmd';
import { getRepoInfo } from '../constants';
import { readConfigFile } from './fs';
import { configPath } from './paths';

import { bubbleErr, bubbleWarn } from './logger';

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

const getGitHubToken = () => {
  const configObj = readConfigFile(configPath, 'JSON');

  return configObj.github_access_token;
};

const triggerRemoteRepoAppsTeardown = async ({ owner, repo, pullRequestIds }) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${DELETE_ALL_WORKFLOW_FILE}/dispatches`;
  const token = getGitHubToken();

  const headerData = {
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `token ${token}`,
    },
  };

  const body = {
    ref: 'main',
    inputs: {
      'pr-numbers': pullRequestIds,
    },
  };

  try {
    await axios.post(url, body, headerData);
  } catch (e) {
    if (e.response.status === 422 && e.response.data.message.includes('pr-numbers')) {
      bubbleWarn('Looks like there are no preview apps to be deleted for this repository!');
    } else {
      bubbleErr(`Remote Preview Apps Teardown Failed ${e}`);
    }
  }
};

const deleteApps = async () => {
  const { owner, repo } = await getRepoInfo();
  const appsDetails = await getAppsDetails(repo);

  const activePullRequestIds = getActivePullRequestIdsString(appsDetails);
  await triggerRemoteRepoAppsTeardown({ owner, repo, pullRequestIds: activePullRequestIds });
};

export default { deleteApps, getGitHubToken };
