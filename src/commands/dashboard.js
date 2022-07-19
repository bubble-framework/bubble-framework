const {
  bubbleErr,
  bubbleWarn
} = require("../util/logger");

const { bubbleDashboardServerFolderPath } = require("../util/paths");

// const { wrapExecCmd } = require("../util/wrapExecCmd");

// const { exec } = require("child_process");

const { spawn } = require("child_process");


const dashboard = async () => {
  try {
    // if (!existingAwsUser()) {
    //   throw new Error();
    // }

    try {
      // cp.exec("config.js", {cwd: bubbleDashboardServerFolderPath}, function(error,stdout,stderr){
      // });
      // const spawn = cp.spawn
      const childResult = spawn('npm', ['run', 'dashboard'], {cwd: bubbleDashboardServerFolderPath});
      childResult.stdout.on('data', data => {
        console.log(`stdout: ${data}`);
      });
      childResult.stderr.on('data', data => {
        console.error(`stderr: ${data}`);
      });
      childResult.on('close', code => {
        console.log(`child process exited with code ${code}`);
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