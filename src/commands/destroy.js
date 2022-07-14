const { deleteUserAll } = require('../util/deleteUser');
const { deleteApps } = require('../util/deleteApps');
const { deleteDatabase } = require("../util/deleteDatabase")
const { deleteLocalFiles } = require('../util/deleteLocalFiles')

const destroy = async () => {
  await deleteApps();
  await deleteDatabase('PreviewApps');
  deleteLocalFiles();
}

module.exports = { destroy };
