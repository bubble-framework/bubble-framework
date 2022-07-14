const { deleteLambdas } = require('../util/deleteLambdas');
const { deleteDatabase } = require('../util/deleteDatabase');
const { deleteUserAll } = require('../util/deleteUser');

const teardown = async () => {
  await deleteLambdas();
  await deleteDatabase('Lambdas')
  await deleteUserAll();
}

module.exports = { teardown };
