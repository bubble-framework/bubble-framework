const fs = require("fs");
const { wrapExecCmd } = require("./wrapExecCmd");
const { spawnSync } = require("child_process");
const { readConfigFile } = require("./fs");
const {
  bubbleGeneral,
  bubbleSuccess,
  bubbleErr
} = require("./logger");
const {
  dataFolderPath,
  bubbleDashboardRootFolderPath,
  bubbleDashboardClientFolderPath,
  bubbleDashboardServerFolderPath,
  configPath
} = require("./paths");
const {
  DASHBOARD_CLONE_MSG,
  DASHBOARD_INSTALL_MSG
} = require("./messages");

const addDashboardFolder = async () => {
  try {
    if (!fs.existsSync(bubbleDashboardRootFolderPath)) {
      bubbleGeneral(DASHBOARD_CLONE_MSG);

      const ghPAT = readConfigFile(configPath, "JSON")["github_access_token"];
      spawnSync('git', ['clone', `https://${ghPAT}@github.com/jjam-bubble/bubble-dashboard.git`], {cwd: dataFolderPath});
      await wrapExecCmd(`cd ${bubbleDashboardRootFolderPath} && rm -r .git`);

      bubbleGeneral(DASHBOARD_INSTALL_MSG);
      spawnSync('npm', ['install'], {cwd: bubbleDashboardClientFolderPath});
      spawnSync('npm', ['install'], {cwd: bubbleDashboardServerFolderPath});

      bubbleSuccess(`saved in ${bubbleDashboardRootFolderPath}`, "Bubble dashboard files: ");
    } else {
      bubbleSuccess("already saved", "Bubble dashboard folder: ");
    }
  } catch(err) {
    bubbleErr(`Couldn't save Bubble dashboard files due to: ${err}`);
  }
};

module.exports = { addDashboardFolder };