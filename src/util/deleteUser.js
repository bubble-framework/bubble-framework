const prompts = require("prompts");

const {
  bubbleErr,
  bubbleSuccess,
  bubbleWarn
} = require("jjam-bubble/src/util/logger");

const { wrapExecCmd } = require("jjam-bubble/src/util/wrapExecCmd");

const { getRepoInfo } = require('jjam-bubble/src/util/addGithubSecrets');
const { checkExistingUser } = require("jjam-bubble/src/aws/checkExistingUser");
const { validateGithubConnection } = require("jjam-bubble/src/util/addGithubSecrets");
const { deleteUser } = require("jjam-bubble/src/aws/deleteUser");
const { deleteUserPolicy } = require("jjam-bubble/src/aws/deleteUserPolicy");
const { getUserAccessKey } = require("jjam-bubble/src/aws/getUserAccessKey");
const { deleteUserAccessKey } = require("jjam-bubble/src/aws/deleteUserAccessKey");
const { deleteGithubSecrets } = require("jjam-bubble/src/util/deleteGithubSecrets");

const existingAwsUser = async () => {
  try {
    const { repo } = await getRepoInfo();
    await wrapExecCmd(checkExistingUser(repo));
    return true;
  } catch {
    return false;
  }
}

const deleteAwsUser = async () => {
  const { repo } = await getRepoInfo();
  await wrapExecCmd(deleteUserPolicy(repo));
  const { AccessKeyMetadata } = JSON.parse(await wrapExecCmd(getUserAccessKey(repo)));
  await wrapExecCmd(deleteUserAccessKey(AccessKeyMetadata[0].AccessKeyId, repo));
  await wrapExecCmd(deleteUser(repo));
}

const deleteUserAll = async () => {
  if (existingAwsUser()) {
    try {
      await deleteGithubSecrets();
      await deleteAwsUser();
      bubbleSuccess("deleted", "The user and its Github secrets have been deleted");
    } catch (err) {
      bubbleErr(`user deletion failed, ${err}`);
    }
  } else {
    bubbleErr("There is no user created for this repo yet.");
  }
}

module.exports = { deleteUserAll } 