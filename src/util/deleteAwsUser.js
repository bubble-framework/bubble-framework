const {
  bubbleErr,
  bubbleSuccess,
  bubbleWarn
} = require("./logger");

const { wrapExecCmd } = require("./wrapExecCmd");

const { getRepoInfo } = require('../util/addGithubSecrets');
const { checkExistingUser } = require("../aws/checkExistingUser");
const { validateGithubConnection } = require("../util/addGithubSecrets");
const { deleteUser } = require("../aws/deleteUser");
const { deleteUserPolicy } = require("../aws/deleteUserPolicy")
const { getUserAccessKey } = require("../aws/getUserAccessKey")
const { deleteUserAccessKey } = require("../aws/deleteUserAccessKey")

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
  await wrapExecCmd(deleteUserPolicy(repo))
  const { AccessKeyMetadata } = JSON.parse(await wrapExecCmd(getUserAccessKey(repo)))
  await wrapExecCmd(deleteUserAccessKey(AccessKeyMetadata[0].AccessKeyId, repo))
  await wrapExecCmd(deleteUser(repo));
}

module.exports = { existingAwsUser, deleteAwsUser } 