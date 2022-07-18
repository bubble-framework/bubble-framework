import { bubbleGeneral, bubbleErr, bubbleSuccess } from './logger';
import { DELETING_BUBBLE_USER_MSG, NONEXISTENT_BUBBLE_AWS_USER_MSG } from './messages';
import { wrapExecCmd } from './wrapExecCmd';
import { getRepoInfo } from '../constants';

import awsService from '../services/awsService';

import deleteGithubSecrets from './deleteGithubSecrets';
import { deleteConfig, deleteCredentials } from './deleteAwsProfile';

export const existingAwsUser = async () => {
  try {
    const { repo } = await getRepoInfo();
    await wrapExecCmd(awsService.checkExistingUser(repo));
    return true;
  } catch {
    return false;
  }
};

export const deleteAwsUser = async (repo) => {
  await wrapExecCmd(awsService.deleteUserPolicy(repo));

  const { AccessKeyMetadata } = JSON.parse(
    await wrapExecCmd(awsService.getUserAccessKey(repo)),
  );

  await wrapExecCmd(
    awsService.deleteUserAccessKey(AccessKeyMetadata[0].AccessKeyId, repo),
  );

  await wrapExecCmd(awsService.deleteUser(repo));
};

export const deleteUserAll = async () => {
  const { repo } = await getRepoInfo();
  if (existingAwsUser()) {
    try {
      bubbleGeneral(DELETING_BUBBLE_USER_MSG);
      await deleteGithubSecrets();
      await deleteAwsUser(repo);
      deleteConfig(repo);
      deleteCredentials(repo);
      bubbleSuccess('deleted', 'User and its Github secrets: ');
    } catch (err) {
      bubbleErr(`User deletion failed due to: ${err}.`);
    }
  } else {
    bubbleErr(NONEXISTENT_BUBBLE_AWS_USER_MSG);
  }
};
