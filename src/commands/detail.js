const { getExistingApps } = require('../util/getExistingApps');
const { outputTableFromArray } = require('../util/consoleMessage');

const detail = async () => {
  const apps = await getExistingApps();
  if (apps.length === 0) {
    apps.push("There are no preview apps at the moment")
  }
  outputTableFromArray(apps);
}

module.exports = { detail }