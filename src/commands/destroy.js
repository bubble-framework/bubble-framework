const { deleteApps } = require('../util/deleteApps');
const { deleteLocalFiles } = require('../util/deleteLocalFiles');
const { getRepoInfo } = require('../util/addGithubSecrets');
const {
  bubbleBold
} = require("../util/logger");
const {
  WAIT_TO_DESTROY_MSG,
  DESTROY_DONE_MSG,
  randomJokeSetup,
  waitForJokeSetup,
  waitForJokePunchline,
  instructTeardown
} = require("../util/messages");

const destroy = async () => {
  bubbleBold(WAIT_TO_DESTROY_MSG);
  const { repo } = await getRepoInfo();
  const randomJoke = randomJokeSetup('DESTROY');
  bubbleBold(waitForJokeSetup(randomJoke));

  await deleteApps();

  bubbleBold(waitForJokePunchline(randomJoke, 'DESTROY'));

  deleteLocalFiles();

  bubbleBold(DESTROY_DONE_MSG);
  bubbleBold(instructTeardown(repo));
}

module.exports = { destroy };
