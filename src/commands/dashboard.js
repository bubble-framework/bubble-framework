import childProcess from 'child_process';

import {
  bubbleGeneral,
  bubbleErr,
  bubbleWarn,
  bubbleConclusionSecondary,
} from '../util/logger.js';

import { bubbleDashboardServerFolderPath } from '../util/paths.js';
import { existingAwsUser } from '../util/deleteUser.js';

import {
  DASHBOARD_STARTUP_MSG,
  dashboardUrlMessage,
  commandsOutOfOrder,
} from '../util/messages.js';

import { getRepoInfo } from '../constants.js';

const dashboard = async () => {
  try {
    if (!existingAwsUser()) {
      throw new Error();
    }

    try {
      const { repo } = await getRepoInfo();

      bubbleGeneral(DASHBOARD_STARTUP_MSG);

      const childResult = childProcess.spawn(
        'npm',
        ['run', 'dashboard'],
        { cwd: bubbleDashboardServerFolderPath },
      );

      childResult.stdout.on('data', (data) => {
        if (data.includes('You can now view bubble-dashboard in the browser')) {
          bubbleConclusionSecondary(dashboardUrlMessage(repo), 1);
        }
      });
    } catch (err) {
      bubbleErr(`Could not start up dashboard due to: ${err}!`);
    }
  } catch {
    bubbleWarn(commandsOutOfOrder('dashboard'));
  }
};

export default dashboard;
