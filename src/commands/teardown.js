const fs = require("fs");
const { deleteLambdas } = require('../util/deleteLambdas');
const { deleteDatabase } = require('../util/deleteDatabase');
const { deleteUserAll } = require('../util/deleteUser');
const {
  bubbleErr,
  bubbleWarn,
  bubbleIntro,
  bubbleSetup,
  bubblePunchline,
  bubbleConclusionPrimary
} = require('../util/logger');
const {
  WAIT_TO_TEARDOWN_MSG,
  TEARDOWN_DONE_MSG,
  LAMBDA_TEARDOWN_ERROR_MSG,
  commandsOutOfOrder,
  randomJokeSetup,
  waitForJokeSetup,
  waitForJokePunchline
} = require("../util/messages");
const { removeFromActiveReposFile } = require("../util/fs");

const { existingAwsUser } = require("../util/deleteUser");

const teardown = async () => {
  try {
    // if (!existingAwsUser() || fs.existsSync("./.github")) {
    //   throw new Error();
    // }

    // const { repo } = await getRepoInfo();

    bubbleIntro(WAIT_TO_TEARDOWN_MSG, 2);
    // const randomJoke = randomJokeSetup('TEARDOWN');
    // bubbleSetup(waitForJokeSetup(randomJoke), 2);

    // try {
    //   await deleteLambdas();
    // } catch (err) {
    //   bubbleErr(err);
    //   bubbleWarn(LAMBDA_TEARDOWN_ERROR_MSG);
    //   return;
    // }

    // bubblePunchline(`\n${waitForJokePunchline(randomJoke, 'TEARDOWN')}`, 2);

    // await deleteDatabase('Lambdas')
    // await deleteUserAll();

    const repo = 'bubble-test-next-search-app'
    removeFromActiveReposFile(repo);
    bubbleConclusionPrimary(TEARDOWN_DONE_MSG);
  } catch {
    bubbleWarn(commandsOutOfOrder('teardown'));
  }
}

module.exports = { teardown };
