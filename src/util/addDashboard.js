const fs = require("fs");
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
const { wrapExecCmd } = require("./wrapExecCmd");
const { readConfigFile } = require("./fs");
const { spawn } = require("child_process");

const emoji = require('node-emoji');
// const {
//   DASHBOARD_INSTALL_MSG
// } = require("./messages");

const wrapSpawnCmd = async (cmd, args, path) => {
  const childResult = spawn(cmd, args, {cwd: path});

  childResult.stdout.on('data', data => {
    return data;
  });
  childResult.stderr.on('data', data => {
    return `stderr: ${data}`;
  });
};

const addDashboardFolder = async () => {
  try {
    if (!fs.existsSync(bubbleDashboardRootFolderPath)) {
      bubbleGeneral("Getting your dashboard set up for easy viewing of all your bubbles...");
      const ghPAT = readConfigFile(configPath, "JSON")["github_access_token"];

      const childResult = await wrapSpawnCmd('git', ['clone', `https://${ghPAT}@github.com/jjam-bubble/bubble-dashboard.git`], dataFolderPath);
      // const childResult = spawn('git', ['clone', `https://${ghPAT}@github.com/jjam-bubble/bubble-dashboard.git`], {cwd: dataFolderPath});
      // childResult.stdout.on('data', data => {
      //   console.log(`stdout: ${data}`);
      // });
      // childResult.stderr.on('data', data => {
      //   console.error(`stderr: ${data}`);
      // });
      // childResult.on('close', code => {
      //   console.log(`child process exited with code ${code}`);
      // });

      // await wrapExecCmd(`cd ${dataFolderPath} && git clone https://${ghPAT}@github.com/jjam-bubble/bubble-dashboard.git`);
      // await wrapExecCmd(`cd ${bubbleDashboardRootFolderPath} && rm -r .git`);
      bubbleGeneral(`Nearly done with your dashboard! Just installing a few things ${emoji.get('wrench')}...`);
      // await wrapExecCmd(`cd ${bubbleDashboardClientFolderPath} && npm install`);
      // await wrapExecCmd(`cd ${bubbleDashboardServerFolderPath} && npm install`);
      bubbleSuccess(`saved in ${bubbleDashboardRootFolderPath}`, "Bubble dashboard files: ");
    } else {
      bubbleSuccess("already saved", "Bubble dashboard folder: ");
    }
  } catch(err) {
    bubbleErr(`Couldn't save Bubble dashboard files due to: ${err}`);
  }
  // check if folder exists
  // if not:
  //git clone into .bubble
  //remove .git folder from cloned folder
  //run npm install in client and server folders
};

module.exports = { addDashboardFolder }