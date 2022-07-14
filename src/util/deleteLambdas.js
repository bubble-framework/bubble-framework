const { getLambdaFunctions } = require('../aws/getLambdaFunctions');
const { getLambdaPrefixFromDb } = require('../aws/getLambdaPrefixFromDb');
const { deleteLambda } = require('../aws/deleteLambda');
const { wrapExecCmd } = require("../util/wrapExecCmd");
const { getRepoInfo } = require("../util/addGithubSecrets");
const { bubbleErr, bubbleSuccess } = require('./logger');

const deleteLambdas = async () => {
  const { repo } = getRepoInfo();
  let prefixes = JSON.parse(await wrapExecCmd(getLambdaPrefixFromDb(repo)));
  prefixes = prefixes.Items.flatMap(lambda => lambda.LambdaId.S);

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
    bubbleErr(`Lambdas are not ready to be deleted yet: ${err}`)
  }
}

module.exports = { deleteLambdas };