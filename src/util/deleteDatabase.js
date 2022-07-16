const { wrapExecCmd } = require("../util/wrapExecCmd");
const { deleteTable } = require('../aws/deleteTable');
const { getRepoInfo } = require('./addGithubSecrets');
const {
  bubbleSuccess,
  bubbleErr,
  bubbleBold
} = require("./logger");
const {
  dbDeletionError
} = require("./messages");

const deleteDatabase = async (name) => {
  const { repo } = await getRepoInfo();
  bubbleBold(`Now deleting the ${repo}-${name} database...`);

  try {
    await wrapExecCmd(deleteTable(repo, name));
    bubbleSuccess("deleted", `${name} database: `);
  } catch (err) {
    bubbleErr(err);
    bubbleBold(dbDeletionError(repo, name));
  }
};

module.exports = { deleteDatabase };