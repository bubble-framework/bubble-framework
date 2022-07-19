const {
  bubbleGeneral,
  bubbleErr,
  bubbleWarn
} = require("../util/logger");

const { bubbleDashboardServerFolderPath } = require("../util/paths");

// const { wrapExecCmd } = require("../util/wrapExecCmd");

// const { exec } = require("child_process");

const { spawn } = require("child_process");
const { getRepoInfo } = require('../constants');
const emoji = require('node-emoji');


const dashboard = async () => {
  try {
    // if (!existingAwsUser()) {
    //   throw new Error();
    // }

    try {
      const { repo } = await getRepoInfo();
      // cp.exec("config.js", {cwd: bubbleDashboardServerFolderPath}, function(error,stdout,stderr){
      // });
      // const spawn = cp.spawn
      bubbleGeneral("Bubblin' up your dashboard...\n");
      const childResult = spawn('npm', ['run', 'dashboard'], {cwd: bubbleDashboardServerFolderPath});
      childResult.stdout.on('data', data => {
        if (data.includes('You can now view bubble-dashboard in the browser')) {
          bubbleGeneral(`Your dashboard is live at http://localhost:3000/${repo}! Cmd/Ctrl + bubble-click on the url and hop aboard this chew chew train ${emoji.get('train')} to check out all the bubbles we've blown up for ya!`);
        }
      });
      // const result = await wrapExecCmd(`cd ${bubbleDashboardServerFolderPath} && npm run dashboard`)
      // await wrapExecCmd(`cd ${bubbleDashboardServerFolderPath}`) && wrapExecCmd(`node config.js`);
      // process.chdir(bubbleDashboardServerFolderPath);
      // console.log(process.cwd())
      // const result = await wrapExecCmd(`node config.js`)
      // console.log(result.trim())
      // await wrapExecCmd(`npm run dashboard`);
    } catch (err) {
      bubbleErr(`Could not start up dashboard due to: ${err}!`)
    }
  } catch {
    bubbleWarn(commandsOutOfOrder('dashboard'));
  }
}

module.exports = { dashboard }