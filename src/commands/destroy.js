//2. bubble destroy
// - delete preview apps
// 	- iterate through pull requests on command line
// 	- actually delete preview app by dispatching the same (pull request close) workflow?
// - delete database
// - delete all bubble-related local files

const { deleteUserAll } = require('../util/deleteUser');
const { deleteApps } = require('../util/deleteApps');

const destroy = async () => {
  // deleteUserAll();

}

module.exports = { destroy };
