const { wrapExecCmd } = require("../util/wrapExecCmd");

const { deleteTable } = require('../aws/deleteTable');
const { getRepoInfo } = require('../constants');

const {
  bubbleGeneral,
  bubbleSuccess,
  bubbleErr,
  bubbleWarn
} = require("./logger");

const {
  dbDeletionError
} = require("./messages");

const deleteDatabase = async (name) => {
  const { repo } = await getRepoInfo();
  bubbleGeneral(`Deleting the ${repo}-${name} database...`);

  try {
    await wrapExecCmd(deleteTable(repo, name));
    bubbleSuccess("deleted", `${name} database: `);
  } catch (err) {
    bubbleErr(err);
    bubbleWarn(dbDeletionError(repo, name));
  }
};

module.exports = { deleteDatabase };