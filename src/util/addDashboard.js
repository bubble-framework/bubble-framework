import fs from 'fs';
import childProcess from 'child_process';

import wrapExecCmd from './wrapExecCmd.js';
import { readConfigFile } from './fs.js';
import { bubbleGeneral, bubbleSuccess, bubbleErr } from './logger.js';

import {
  dataFolderPath,
  bubbleDashboardRootFolderPath,
  bubbleDashboardClientFolderPath,
  bubbleDashboardServerFolderPath,
  configPath,
} from './paths.js';

import { DASHBOARD_CLONE_MSG, DASHBOARD_INSTALL_MSG } from './messages.js';

const addDashboardFolder = async () => {
  try {
    if (!fs.existsSync(bubbleDashboardRootFolderPath)) {
      bubbleGeneral(DASHBOARD_CLONE_MSG);

      const ghPAT = readConfigFile(configPath, 'JSON').github_access_token;

      childProcess.spawnSync(
        'git',
        ['clone', `https://${ghPAT}@github.com/jjam-bubble/bubble-dashboard.git`],
        { cwd: dataFolderPath },
      );

      await wrapExecCmd(`cd ${bubbleDashboardRootFolderPath} && rm -r .git`);

      bubbleGeneral(DASHBOARD_INSTALL_MSG);

      childProcess.spawnSync('npm', ['install'], { cwd: bubbleDashboardClientFolderPath });
      childProcess.spawnSync('npm', ['install'], { cwd: bubbleDashboardServerFolderPath });

      bubbleSuccess(
        `saved in ${bubbleDashboardRootFolderPath}`,
        'Bubble dashboard files: ',
      );
    } else {
      bubbleSuccess('already saved', 'Bubble dashboard folder: ');
    }
  } catch (e) {
    bubbleErr(`Couldn't save Bubble dashboard files due to: ${e}`);
  }
};

export default { addDashboardFolder };
