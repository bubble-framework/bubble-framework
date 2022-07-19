import wrapExecCmd from './wrapExecCmd.js';

import awsService from '../services/awsService.js';
import { getRepoInfo } from '../constants.js';

import {
  bubbleGeneral,
  bubbleSuccess,
  bubbleErr,
  bubbleWarn,
} from './logger.js';

import { dbDeletionError } from './messages.js';

const deleteDatabase = async (name) => {
  const { repo } = await getRepoInfo();
  bubbleGeneral(`Deleting the ${repo}-${name} database...`);

  try {
    await wrapExecCmd(awsService.deleteTable(repo, name));
    bubbleSuccess('deleted', `${name} database: `);
  } catch (err) {
    bubbleErr(err);
    bubbleWarn(dbDeletionError(repo, name));
  }
};

export default deleteDatabase;
