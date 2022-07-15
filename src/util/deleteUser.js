const prompts = require("prompts");

const {
  bubbleErr,
  bubbleSuccess,
  bubbleWarn
} = require("./logger");

const { wrapExecCmd } = require("./wrapExecCmd");

const { getRepoInfo } = require('./addGithubSecrets');
const { checkExistingUser } = require("../aws/checkExistingUser");
const { deleteUser } = require("../aws/deleteUser");
const { deleteUserPolicy } = require("../aws/deleteUserPolicy");
const { getUserAccessKey } = require("../aws/getUserAccessKey");
const { deleteUserAccessKey } = require("../aws/deleteUserAccessKey");
const { deleteGithubSecrets } = require("./deleteGithubSecrets");
const { deleteConfig, deleteCredentials } = require('./deleteAwsProfile');

const existingAwsUser = async () => {
  try {
    const { repo } = await getRepoInfo();
    await wrapExecCmd(checkExistingUser(repo));
    return true;
  } catch {
    return false;
  }
}

const deleteAwsUser = async (repo) => {
  await wrapExecCmd(deleteUserPolicy(repo));
  const { AccessKeyMetadata } = JSON.parse(await wrapExecCmd(getUserAccessKey(repo)));
  await wrapExecCmd(deleteUserAccessKey(AccessKeyMetadata[0].AccessKeyId, repo));
  await wrapExecCmd(deleteUser(repo));
}

const deleteUserAll = async () => {
  let { repo } = await getRepoInfo();
  if (existingAwsUser()) {
    try {
      await deleteGithubSecrets();
      await deleteAwsUser(repo);
      deleteConfig(repo);
      deleteCredentials(repo);
      bubbleSuccess("deleted", "The user and its Github secrets have been deleted");
    } catch (err) {
      bubbleErr(`user deletion failed, ${err}`);
    }
  } else {
    bubbleErr("There is no user created for this repo yet.");
  }
}

module.exports = { deleteUserAll }
