import { existsSync } from 'fs';

import deleteLambdas from '../util/deleteLambdas.js';
import deleteDatabase from '../util/deleteDatabase.js';
import { deleteUserAll, existingAwsUser } from '../util/deleteUser.js';
import doesTableExist from '../util/doesTableExist.js';

import { getRepoInfo } from '../constants.js';

import { removeFromActiveReposFile } from '../util/fs.js';

import {
  bubbleErr,
  bubbleWarn,
  bubbleIntro,
  bubbleSetup,
  bubblePunchline,
  bubbleConclusionPrimary,
} from '../util/logger.js';

import {
  WAIT_TO_TEARDOWN_MSG,
  TEARDOWN_DONE_MSG,
  LAMBDA_TEARDOWN_ERROR_MSG,
  commandsOutOfOrder,
  randomJokeSetup,
  waitForJokeSetup,
  waitForJokePunchline,
} from '../util/messages.js';

const teardown = async () => {
  try {
    if (!existingAwsUser() || existsSync('./.github')) {
      throw new Error();
    }

    const { repo } = await getRepoInfo();

    bubbleIntro(WAIT_TO_TEARDOWN_MSG, 2);
    const randomJoke = randomJokeSetup('TEARDOWN');
    bubbleSetup(waitForJokeSetup(randomJoke), 2);

    const previewTableExists = await doesTableExist(repo, 'PreviewApps');

    if (previewTableExists) {
      await deleteDatabase('PreviewApps');
    }

    try {
      await deleteLambdas();
    } catch (err) {
      bubbleErr(err);
      bubbleWarn(LAMBDA_TEARDOWN_ERROR_MSG);
      return;
    }

    bubblePunchline(`\n${waitForJokePunchline(randomJoke, 'TEARDOWN')}`, 2);

    await deleteDatabase('Lambdas');
    await deleteUserAll();

    removeFromActiveReposFile(repo);
    bubbleConclusionPrimary(TEARDOWN_DONE_MSG);
  } catch {
    bubbleWarn(commandsOutOfOrder('teardown'));
  }
};

export default teardown;
