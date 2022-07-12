//2. bubble destroy
// - delete user <-- command line
// - delete preview apps
// 	- iterate through pull requests on command line
// 	- actually delete preview app by dispatching the same (pull request close) workflow?
// - delete GH secrets via workflow
// - delete all bubble-related local files

const { deleteUserAll } = require('../util/deleteUser');

const destroy = async () => {
  deleteUserAll();
}

module.exports = { destroy };