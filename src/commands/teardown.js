const fs = require("fs");
const { deleteLambdas } = require('../util/deleteLambdas');
const { deleteDatabase } = require('../util/deleteDatabase');
const { deleteUserAll } = require('../util/deleteUser');
const {
  bubbleErr,
  bubbleBold
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

const { existingAwsUser } = require("../util/deleteUser");

const teardown = async () => {
  try {
    if (!existingAwsUser() || fs.existsSync("./.github")) {
      throw new Error();
    }

    bubbleBold(WAIT_TO_TEARDOWN_MSG);
    const randomJoke = randomJokeSetup('TEARDOWN');
    bubbleBold(waitForJokeSetup(randomJoke));

    try {
      await deleteLambdas();
    } catch (err) {
      bubbleErr(err);
      bubbleBold(LAMBDA_TEARDOWN_ERROR_MSG);
      return;
    }

    bubbleBold(`\n${waitForJokePunchline(randomJoke, 'TEARDOWN')}`);

    await deleteDatabase('Lambdas')
    await deleteUserAll();

    bubbleBold(TEARDOWN_DONE_MSG);
  } catch {
    bubbleBold(commandsOutOfOrder('teardown'));
  }
}

module.exports = { teardown };
