import { deleteApps } from '../util/deleteApps';
import { deleteLocalFiles } from '../util/deleteLocalFiles';

import { wrapExecCmd } from "../util/wrapExecCmd";
import { getRepoInfo } from '../util/addGithubSecrets';
import { bubbleIntro, bubbleLoading, bubblePunchline, bubbleConclusionPrimary, bubbleConclusionSecondary, bubbleWarn } from "../util/logger";
import { WAIT_TO_DESTROY_MSG, DESTROY_WORKFLOWS_COMPLETING_MSG, commandsOutOfOrder, randomJokeSetup, waitForJokeSetup, waitForJokePunchline, instructTeardown } from "../util/messages";
import { validateGithubConnection } from "../util/addGithubSecrets";

import { existingAwsUser } from "../util/deleteUser";

const destroy = async () => {
  try {
    if (!existingAwsUser()) {
      throw new Error();
    }

    await validateGithubConnection();

    bubbleIntro(WAIT_TO_DESTROY_MSG, 2);
    const { repo } = await getRepoInfo();
    const randomJoke = randomJokeSetup('DESTROY');
    let spinner;
    spinner = bubbleLoading(waitForJokeSetup(randomJoke), 2);
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
}

export default { destroy };
