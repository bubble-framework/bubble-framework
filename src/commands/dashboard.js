import childProcess from 'child_process';
import axios from 'axios';
import { readConfigFile } from '../util/fs.js';

import {
  bubbleGeneral,
  bubbleErr,
  bubbleWarn,
  bubbleConclusionSecondary,
} from '../util/logger.js';

import { bubbleDashboardServerFolderPath, activeReposPath } from '../util/paths.js';
import { existingAwsUser } from '../util/deleteUser.js';

import {
  DASHBOARD_STARTUP_MSG,
  DASHBOARD_HOLDUP_MSG,
  RUN_FROM_NONBUBBLE_MSG,
  dashboardUrlMessage,
  commandsOutOfOrder,
} from '../util/messages.js';

import { getRepoInfo } from '../constants.js';

const isActiveRepo = (activeRepos, currentRepoName) => (
  activeRepos.some(({ repoName }) => repoName === currentRepoName)
);

const dashboard = async () => {
  try {
    if (!existingAwsUser()) {
      throw new Error();
    }

    try {
      const { repo } = await getRepoInfo();

      const activeRepos = readConfigFile(activeReposPath, 'JSON');
      if (!isActiveRepo(activeRepos, repo)) {
        bubbleErr(RUN_FROM_NONBUBBLE_MSG);
        return;
      }

      bubbleGeneral(DASHBOARD_STARTUP_MSG);
      let startedUp;

      const childResult = childProcess.spawn(
        'npm',
        ['run', 'dashboard'],
        { cwd: bubbleDashboardServerFolderPath },
      );

      childResult.stdout.on('data', async (data) => {
        if (data.includes('You can now view bubble-dashboard in the browser')) {
          bubbleConclusionSecondary(dashboardUrlMessage(repo), 1);
          dashboard.startedUp = true;
          startedUp = true;
        }
      });

      setTimeout(async () => {
        if (!startedUp) {
          try {
            const { status } = await axios.get('http://localhost:3000');

            if (status === 200) {
              bubbleConclusionSecondary(dashboardUrlMessage(repo), 1);
            }
          } catch {
            bubbleErr(DASHBOARD_HOLDUP_MSG);
            process.exit();
          }
        }
      }, 15000);
    } catch (err) {
      if (err.toString().includes('Command failed: git config --get remote.origin.url')) {
        bubbleErr(RUN_FROM_NONBUBBLE_MSG);
      } else {
        bubbleErr(`Could not start up dashboard due to: ${err}!`);
      }
    }
  } catch {
    bubbleWarn(commandsOutOfOrder('dashboard'));
  }
};

export default dashboard;
