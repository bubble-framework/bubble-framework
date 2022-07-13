const prompts = require("prompts");

const {
  bubbleErr,
  bubbleSuccess,
  bubbleWarn
} = require("./logger");

const { wrapExecCmd } = require("./wrapExecCmd");

const { getRepoInfo } = require('./addGithubSecrets');
const { checkExistingUser } = require("../aws/checkExistingUser");
const { validateGithubConnection } = require("./addGithubSecrets");
const { deleteUser } = require("../aws/deleteUser");
const { deleteUserPolicy } = require("../aws/deleteUserPolicy");
const { getUserAccessKey } = require("../aws/getUserAccessKey");
const { deleteUserAccessKey } = require("../aws/deleteUserAccessKey");
const { deleteGithubSecrets } = require("./deleteGithubSecrets");

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
