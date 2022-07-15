const { getPreviewAppsDetails } = require('../aws/getPreviewAppsDetails');
const { wrapExecCmd } = require('./wrapExecCmd');
const { getRepoInfo } = require('../constants');
const { readConfigFile } = require('./fs');
const { configPath } = require('./paths');

const axios = require('axios');
const { bubbleErr } = require('./logger');

const DELETE_ALL_WORKFLOW_FILE = 'destroy.yml';

const getAppsDetails = async (repoName) => {
  const rawAppsDetails = await wrapExecCmd(getPreviewAppsDetails(repoName));

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
  const configObj = readConfigFile(configPath, "JSON");

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
  } catch (err) {
    bubbleErr(`Remote Preview Apps Teardown Failed ${err}`)
  }
};

const deleteApps = async () => {
  const { owner, repo } = await getRepoInfo();
  const appsDetails = await getAppsDetails(repo);

  const activePullRequestIds = getActivePullRequestIdsString(appsDetails);
  await triggerRemoteRepoAppsTeardown({ owner, repo, pullRequestIds: activePullRequestIds });
};

module.exports = { deleteApps, getGitHubToken };
