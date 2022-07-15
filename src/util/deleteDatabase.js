const { wrapExecCmd } = require("../util/wrapExecCmd");
const { deleteTable } = require('../aws/deleteTable')
const { getRepoInfo } = require('../constants');
const { bubbleSuccess } = require("./logger");

const deleteDatabase = async (name) => {
  const { repo } = await getRepoInfo();
  await wrapExecCmd(deleteTable(repo, name));
  bubbleSuccess("deleted", `${name} database: `)
}

module.exports = { deleteDatabase }