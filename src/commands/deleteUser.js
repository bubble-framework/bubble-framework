const prompts = require("prompts");
const { wrapExecCmd } = require("jjam-bubble/src/util/wrapExecCmd");

const {
  bubbleErr,
  bubbleSuccess
} = require("jjam-bubble/src/util/logger");

const { existingAwsUser } = require('jjam-bubble/src/util/deleteAwsUser')
const { deleteAwsUser } = require('../util/deleteAwsUser')
const { deleteGithubSecrets } = require("../util/deleteGithubSecrets");

const deleteUser = async () => {

  if (existingAwsUser) {

    const question = {
      type: "confirm",
      name: "deleteUser",
      message: `Are you sure you want to delete this user? You will not be able to create or delete preview apps under this user`,
      initial: true,
    };

    const result = await prompts(question);
    if (result.deleteUser) {
      try {
        await deleteGithubSecrets();
        await deleteAwsUser();
        bubbleSuccess("deleted", "The user and its Github secrets have been deleted")
      } catch (err) {
        bubbleErr(`user deletion failed, ${err}`)
      }
    }
  } else {
    bubbleErr("There is no user created for this repo yet.")
  }
}
module.exports = { deleteUser };