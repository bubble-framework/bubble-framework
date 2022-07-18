import { wrapExecCmd } from "./wrapExecCmd";
import awsService from '../services/awsService';
import { getRepoInfo } from './addGithubSecrets';
import { bubbleErr } from './logger';

import { PREVIEWS_TABLE_DELETED_MSG, NO_PREVIEW_DETAILS_RETRIEVED_MSG } from "./messages";

const TABLE_DELETED_ERROR_CODE = 255;

const getExistingApps = async () => {
  const { repo } = await getRepoInfo();
  let details;

  try {
    details = JSON.parse(await wrapExecCmd(awsService.getPreviewAppsDetails(repo))).Items;
  } catch (e) {
    if (e.code === TABLE_DELETED_ERROR_CODE) {
      bubbleErr(PREVIEWS_TABLE_DELETED_MSG);
    } else {
      bubbleErr(NO_PREVIEW_DETAILS_RETRIEVED_MSG);
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
        detail.url = 'https://' + commit.M.CloudfrontSubdomain.S + '.cloudfront.net';
        parsed.push(detail);
      })
    }
  })
  return parsed;
}

export default getExistingApps;