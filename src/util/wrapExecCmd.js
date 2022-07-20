import util from 'util';
import childProcess from 'child_process';

const exec = util.promisify(childProcess.exec);

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
