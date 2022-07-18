const { deleteApps } = require('../util/deleteApps');
const { deleteLocalFiles } = require('../util/deleteLocalFiles');

const { wrapExecCmd } = require("../util/wrapExecCmd");
const { getRepoInfo } = require('../constants');
const {
  bubbleIntro,
  bubbleLoading,
  bubblePunchline,
  bubbleConclusionPrimary,
  bubbleConclusionSecondary,
  bubbleWarn
} = require("../util/logger");
const {
  WAIT_TO_DESTROY_MSG,
  DESTROY_WORKFLOWS_COMPLETING_MSG,
  commandsOutOfOrder,
  randomJokeSetup,
  waitForJokeSetup,
  waitForJokePunchline,
  instructTeardown
} = require("../util/messages");
const {
  getPublicKey
} = require("../services/githubService");
const { updateStatusInActiveReposFile } = require("../util/fs");

const { existingAwsUser } = require("../util/deleteUser");

const destroy = async () => {
  try {
    // if (!existingAwsUser()) {
    //   throw new Error();
    // }

    // await getPublicKey();

    bubbleIntro(WAIT_TO_DESTROY_MSG, 2);
    // const { repo } = await getRepoInfo();
    // const randomJoke = randomJokeSetup('DESTROY');
    // let spinner;
    // spinner = bubbleLoading(waitForJokeSetup(randomJoke), 2);
    // spinner.start();

    // await deleteApps();

    // spinner.succeed();
    // bubblePunchline(waitForJokePunchline(randomJoke, 'DESTROY'), 2);

    // const goToDirectory = await wrapExecCmd('git rev-parse --show-toplevel');
    // process.chdir(goToDirectory.trim());

    // await deleteLocalFiles();
    const repo = 'bubble-test-next-search-app-2'
    updateStatusInActiveReposFile(repo);

    bubbleConclusionPrimary(DESTROY_WORKFLOWS_COMPLETING_MSG, 2);
    // bubbleConclusionSecondary(instructTeardown(repo), 2);
  } catch {
    bubbleWarn(commandsOutOfOrder('destroy'));
  }
}

module.exports = { destroy };
