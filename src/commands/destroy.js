import { deleteApps } from '../util/deleteApps.js';
import deleteLocalFiles from '../util/deleteLocalFiles.js';
import wrapExecCmd from '../util/wrapExecCmd.js';
import { existingAwsUser } from '../util/deleteUser.js';

import {
  bubbleIntro,
  bubbleLoading,
  bubblePunchline,
  bubbleConclusionPrimary,
  bubbleConclusionSecondary,
  bubbleWarn,
} from '../util/logger';

import {
  WAIT_TO_DESTROY_MSG,
  DESTROY_WORKFLOWS_COMPLETING_MSG,
  commandsOutOfOrder,
  randomJokeSetup,
  waitForJokeSetup,
  waitForJokePunchline,
  instructTeardown,
} from '../util/messages';

import { getPublicKey } from '../services/githubService';
import { getRepoInfo } from '../constants';

const destroy = async () => {
  try {
    if (!existingAwsUser()) {
      throw new Error();
    }

    await getPublicKey();

    bubbleIntro(WAIT_TO_DESTROY_MSG, 2);
    const { repo } = await getRepoInfo();
    const randomJoke = randomJokeSetup('DESTROY');
    const spinner = bubbleLoading(waitForJokeSetup(randomJoke), 2);
    spinner.start();

    await deleteApps();

    spinner.succeed();
    bubblePunchline(waitForJokePunchline(randomJoke, 'DESTROY'), 2);

    const goToDirectory = await wrapExecCmd('git rev-parse --show-toplevel');
    process.chdir(goToDirectory.trim());

    await deleteLocalFiles();

    bubbleConclusionPrimary(DESTROY_WORKFLOWS_COMPLETING_MSG, 2);
    bubbleConclusionSecondary(instructTeardown(repo), 2);
  } catch {
    bubbleWarn(commandsOutOfOrder('destroy'));
  }
};

export default { destroy };
