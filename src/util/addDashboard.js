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
const { spawn, spawnSync } = require("child_process");

const emoji = require('node-emoji');
// const {
//   DASHBOARD_INSTALL_MSG
// } = require("./messages");

const wrapSpawnCmd = async (cmd, args, path) => {
  const childResult = spawn(cmd, args, {cwd: path, stdio: 'ignore'});

  return
  // childResult.stdout.on('data', data => {
  //   console.log(`stdout: ${data}`);
  // });
  // childResult.stderr.on('data', data => {
  //   childResult.stderr.pipe(process.stdout);
  //   // echo no stderr 2>/dev/null
  //   console.log(`stderr: ${data}`)
  //   // return `stderr: ${data}`;
  // });
  // childResult.on('close', code => {
  //   if (code === 0) {
  //     console.log(`close: ${code}`);
  //     return;
  //   }
    // return 'done';
  // });
};

const addDashboardFolder = async () => {
  try {
    if (!fs.existsSync(bubbleDashboardRootFolderPath)) {
      bubbleGeneral("Getting your dashboard set up for easy viewing of all your bubbles...");
      const ghPAT = readConfigFile(configPath, "JSON")["github_access_token"];

      // const childResult = await wrapSpawnCmd('git', ['clone', `https://${ghPAT}@github.com/jjam-bubble/bubble-dashboard.git`], dataFolderPath);
      spawnSync('git', ['clone', `https://${ghPAT}@github.com/jjam-bubble/bubble-dashboard.git`], {cwd: dataFolderPath});
      // childResult.stdout.on('data', data => {
      //   console.log(`stdout: ${data}`);
      // });
      // childResult.stderr.on('data', data => {
      //   console.error(`stderr: ${data}`);
      // });
      // childResult.on('close', code => {
      //   console.log(`child process exited with code ${code}`);
      // });
      // console.log(childResult);

      // console.log(childResult);
      // await wrapExecCmd(`cd ${dataFolderPath} && git clone https://${ghPAT}@github.com/jjam-bubble/bubble-dashboard.git`);
      await wrapExecCmd(`cd ${bubbleDashboardRootFolderPath} && rm -r .git`);
      bubbleGeneral(`Nearly done with your dashboard! Just installing a few things ${emoji.get('wrench')} so we don't run into any bubble trouble later...`);
      spawnSync('npm', ['install'], {cwd: bubbleDashboardClientFolderPath});
      console.log('done with client')
      spawnSync('npm', ['install'], {cwd: bubbleDashboardServerFolderPath});

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