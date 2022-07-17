const { getExistingApps } = require('../util/getExistingApps');
const { outputTableFromArray } = require('../util/consoleMessage');
const {
  bubbleBold
} = require("../util/logger");
const {
  DETAIL_INTRO_MSG,
  commandsOutOfOrder
} = require("../util/messages");

const { existingAwsUser } = require("../util/deleteUser");

const detail = async () => {
  try {
    if (!existingAwsUser()) {
      throw new Error();
    }

    bubbleBold(DETAIL_INTRO_MSG);

    const apps = await getExistingApps();
    if (apps.length === 0) {
      apps.push("There are no preview apps at the moment");
    }
    outputTableFromArray(apps);
  } catch {
    bubbleBold(commandsOutOfOrder('detail'));
  }
}

module.exports = { detail }