const {
  bubbleGeneral,
  bubbleErr,
  bubbleWarn,
  bubbleConclusionSecondary
} = require("../util/logger");

const { bubbleDashboardServerFolderPath } = require("../util/paths");

const {
  DASHBOARD_STARTUP_MSG,
  dashboardUrlMessage,
  commandsOutOfOrder
} = require("../util/messages");

const { spawn } = require("child_process");
const { existingAwsUser } = require("../util/deleteUser");
const { getRepoInfo } = require('../constants');

const dashboard = async () => {
  try {
    if (!existingAwsUser()) {
      throw new Error();
    }

    try {
      const { repo } = await getRepoInfo();

      bubbleGeneral(DASHBOARD_STARTUP_MSG);

      const childResult = spawn('npm', ['run', 'dashboard'], {cwd: bubbleDashboardServerFolderPath});
      childResult.stdout.on('data', data => {
        if (data.includes('You can now view bubble-dashboard in the browser')) {
          bubbleConclusionSecondary(dashboardUrlMessage(repo), 1);
        }
      });
    } catch (err) {
      bubbleErr(`Could not start up dashboard due to: ${err}!`)
    }
  } catch {
    bubbleWarn(commandsOutOfOrder('dashboard'));
  }
}

module.exports = { dashboard };