const { getPreviewAppsDetails } = require('../aws/getPreviewAppsDetails');
const { wrapExecCmd } = require('../util/wrapExecCmd');
const { getRepoInfo } = require('../util/addGithubSecrets');
const { readConfigFile } = require('../util/fs');
const { configPath } = require('../util/fs');

const axios = require('axios');

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

const triggerRemoteRepoAppsTeardown = ({ owner, repo, pullRequestIds }) => {
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
      'pull-request-numbers': pullRequestIds,
    },
  };

  axios.post(url, body, headerData);
};

const deleteApps = async () => {
  const { owner, repo } = await getRepoInfo();
  const appsDetails = await getAppsDetails();

  const activePullRequestIds = getActivePullRequestIdsString(appsDetails);
  triggerRemoteRepoAppsTeardown({ owner, repo, pullRequestIds: activePullRequestIds });
};

module.exports = { deleteApps };
