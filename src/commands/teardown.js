const { deleteLambdas } = require('../util/deleteLambdas');
const { deleteDatabase } = require('../util/deleteDatabase');
const { deleteUserAll } = require('../util/deleteUser');
const { bubbleErr } = require('../util/logger');

const teardown = async () => {
  try {
    await deleteLambdas();
  } catch {
    bubbleErr("Lambdas are not ready to be deleted yet; we recommend waiting at least a few hours before trying again later!")
    return;
  }

  await deleteDatabase('Lambdas')
  await deleteUserAll();
}

module.exports = { teardown };
