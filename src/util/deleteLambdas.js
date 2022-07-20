import awsService from '../services/awsService.js';
import wrapExecCmd from './wrapExecCmd.js';

import { getRepoInfo } from '../constants.js';
import { bubbleSuccess } from './logger.js';

const deleteLambdas = async () => {
  const { repo } = await getRepoInfo();
  let prefixes = JSON.parse(await wrapExecCmd(awsService.getLambdaPrefixFromDb(repo)));
  prefixes = prefixes.Items.flatMap((lambda) => lambda.LambdaPrefix.S);

  let functionNames = await Promise.all(prefixes.map((prefix) => (
    wrapExecCmd(awsService.getLambdaFunctions(prefix, repo))
  )));

  functionNames = functionNames
    .map((functionName) => functionName.trim())
    .filter((functionName) => !!functionName);

  try {
    await Promise.all(functionNames.map((functionName) => (
      wrapExecCmd(awsService.deleteLambda(functionName, repo))
    )));

    bubbleSuccess('deleted', 'Lambdas: ');
  } catch (err) {
    throw new Error(err);
  }
};

export default deleteLambdas;
