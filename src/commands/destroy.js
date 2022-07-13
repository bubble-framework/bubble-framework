//2. bubble destroy
// - delete preview apps
// 	- iterate through pull requests on command line
// 	- actually delete preview app by dispatching the same (pull request close) workflow?

const { deleteUserAll } = require('../util/deleteUser');
const { deleteApps } = require('../util/deleteApps');
const { deleteDatabase } = require("../util/deleteDatabase")
const { deleteLocalFiles } = require('../util/deleteLocalFiles')

const destroy = async () => {
  await deleteApps();
  await deleteDatabase();
  deleteLocalFiles();
  await deleteUserAll();
}

module.exports = { destroy };
