const { deleteApps } = require('../util/deleteApps');
const { deleteLocalFiles } = require('../util/deleteLocalFiles');
const { wrapExecCmd } = require("../util/wrapExecCmd");

const destroy = async () => {
  await deleteApps();
  const goToDirectory = await wrapExecCmd('git rev-parse --show-toplevel');
  process.chdir(goToDirectory.trim());
  deleteLocalFiles();
}

module.exports = { destroy };
