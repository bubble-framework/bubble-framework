const { deleteApps } = require('../util/deleteApps');
const { deleteLocalFiles } = require('../util/deleteLocalFiles');

const destroy = async () => {
  await deleteApps();
  deleteLocalFiles();
}

module.exports = { destroy };
