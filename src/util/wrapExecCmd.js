const util = require('util');
const exec = util.promisify(require('child_process').exec);

const wrapExecCmd = async (cmd, errMsg) => {
  try {
    const { stdout, stderr } = await exec(cmd);

    if (stderr) {
      throw new Error(stderr);
    }

    return stdout;
  } catch (e) {
    throw new Error(errMsg || e);
  }
};

export default wrapExecCmd;
