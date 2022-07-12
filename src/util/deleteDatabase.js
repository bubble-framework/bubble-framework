const { wrapExecCmd } = require("../util/wrapExecCmd");
const { deleteTable } = require('../aws/deleteTable')
const { getRepoInfo } = require('./addGithubSecrets')

const deleteDatabase = async () => {
  const { repo } = await getRepoInfo();
  await wrapExecCmd(deleteTable(repo));
}

module.exports = { deleteDatabase }