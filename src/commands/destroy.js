const { deleteApps } = require('../util/deleteApps');
const { deleteLocalFiles } = require('../util/deleteLocalFiles');
const { getRepoInfo } = require('../util/addGithubSecrets');
const {
  bubbleBold
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
  validateGithubConnection
} = require("../util/addGithubSecrets");

const { existingAwsUser } = require("../util/deleteUser");

const destroy = async () => {
  try {
    if (!existingAwsUser()) {
      throw new Error();
    }

    await validateGithubConnection();

    bubbleBold(WAIT_TO_DESTROY_MSG);
    const { repo } = await getRepoInfo();
    const randomJoke = randomJokeSetup('DESTROY');
    bubbleBold(waitForJokeSetup(randomJoke));

    await deleteApps();

    bubbleBold(waitForJokePunchline(randomJoke, 'DESTROY'));

    await deleteLocalFiles();

    bubbleBold(DESTROY_WORKFLOWS_COMPLETING_MSG);
    bubbleBold(instructTeardown(repo));
  } catch {
    bubbleBold(commandsOutOfOrder('destroy'));
  }
}

module.exports = { destroy };
