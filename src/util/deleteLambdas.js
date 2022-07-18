const { getLambdaFunctions } = require('../aws/getLambdaFunctions');
const { getLambdaPrefixFromDb } = require('../aws/getLambdaPrefixFromDb');
const { deleteLambda } = require('../aws/deleteLambda');
const { wrapExecCmd } = require("../util/wrapExecCmd");

const { getRepoInfo } = require("../constants");
const { bubbleSuccess } = require('./logger');

const deleteLambdas = async () => {
  const { repo } = await getRepoInfo();
  let prefixes = JSON.parse(await wrapExecCmd(getLambdaPrefixFromDb(repo)));
  prefixes = prefixes.Items.flatMap(lambda => lambda.LambdaPrefix.S);

  const functions = [];
  for (let i = 0; i < prefixes.length; i++) {
    const result = await wrapExecCmd(getLambdaFunctions(prefixes[i], repo))
    functions.push(result.trim());
  }

  try {
    for (let i = 0; i < functions.length; i++) {
      await wrapExecCmd(deleteLambda(functions[i], repo))
    }
    bubbleSuccess('deleted', "Lambdas: ")
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { deleteLambdas };