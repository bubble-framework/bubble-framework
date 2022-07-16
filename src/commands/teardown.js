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
  randomJokeSetup,
  waitForJokeSetup,
  waitForJokePunchline
} = require("../util/messages");

const teardown = async () => {
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

  bubbleBold(waitForJokePunchline(randomJoke, 'TEARDOWN'));

  await deleteDatabase('Lambdas')
  await deleteUserAll();

  bubbleBold(TEARDOWN_DONE_MSG);
}

module.exports = { teardown };
