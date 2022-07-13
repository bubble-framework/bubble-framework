const { wrapExecCmd } = require("../util/wrapExecCmd");
const { getPreviewAppsDetails } = require('../aws/getPreviewAppsDetails');
const { outputTableFromArray } = require('../util/consoleMessage');
const { getRepoInfo } = require('../util/addGithubSecrets');

const list = async () => {
  const { repo } = getRepoInfo();
  const details = JSON.parse(await wrapExecCmd(getPreviewAppsDetails(repo))).Items;
  const parsed = [];
  details.forEach(pullRequest => {
    pullRequest.Commits.L.forEach(commit => {
      const detail = {};
      detail.pull_request_id = pullRequest.PullRequestId.N;
      detail.pull_request_name = pullRequest.PRName.S;
      detail.commit_id = commit.M.CommitId.S;
      detail.commit_message = commit.M.CommitMessageHeader.S;
      detail.created_at = commit.M.CreatedAt.S;
      parsed.push(detail);
    })
  })
  outputTableFromArray(parsed);
}

module.exports = { list }

