import awsService from '../services/awsService';
import { wrapExecCmd } from "../util/wrapExecCmd";

import { getRepoInfo } from "../constants";
import { bubbleSuccess } from './logger';

const deleteLambdas = async () => {
  const { repo } = await getRepoInfo();
  let prefixes = JSON.parse(await wrapExecCmd(awsService.getLambdaPrefixFromDb(repo)));
  prefixes = prefixes.Items.flatMap(lambda => lambda.LambdaPrefix.S);

  const functions = [];
  for (let i = 0; i < prefixes.length; i++) {
    const result = await wrapExecCmd(
      awsService.getLambdaFunctions(prefixes[i], repo)
    );

    functions.push(result.trim());
  }

  try {
    for (let i = 0; i < functions.length; i++) {
      await wrapExecCmd(awsService.deleteLambda(functions[i], repo))
    }
    bubbleSuccess('deleted', "Lambdas: ")
  } catch (err) {
    throw new Error(err);
  }
}

export default { deleteLambdas };