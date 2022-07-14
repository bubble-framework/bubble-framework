const { wrapExecCmd } = require("../util/wrapExecCmd");
const { getPreviewAppsDetails } = require('../aws/getPreviewAppsDetails');
const { outputTableFromArray } = require('../util/consoleMessage');
const { getRepoInfo } = require('../util/addGithubSecrets');

const { bubbleErr } = require('../util/logger');

const TABLE_DELETED_ERROR_CODE = 255;

const list = async () => {
  const { repo } = await getRepoInfo();
  let details;

  try {
    details = JSON.parse(await wrapExecCmd(getPreviewAppsDetails(repo))).Items;
  } catch (e) {
    if (e.code === TABLE_DELETED_ERROR_CODE) {
      bubbleErr("Looks like bubble isn't set up yet, or has been destroyed. Try running bubble init.");
    } else {
      bubbleErr("We couldn't get the details for your preview apps.");
    }

    return;
  }
  
  const parsed = [];
  details.forEach(pullRequest => {
    if (pullRequest.IsActive.BOOL) {
      pullRequest.Commits.L.forEach(commit => {
        const detail = {};
        detail.pull_request_id = pullRequest.PullRequestId.N;
        detail.pull_request_name = pullRequest.PRName.S;
        detail.commit_id = commit.M.CommitId.S.slice(0, 7);
        detail.commit_message = commit.M.CommitMessageHeader.S;
        detail.created_at = commit.M.CreatedAt.S;
        parsed.push(detail);
      })
    }
  })

  if (parsed.length === 0) {
    parsed.push("There are no preview apps at the moment")
  }

  outputTableFromArray(parsed);
}

module.exports = { list }
