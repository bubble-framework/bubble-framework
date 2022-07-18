import { wrapExecCmd } from "../util/wrapExecCmd";

import { deleteTable } from '../services/awsService';
import { getRepoInfo } from '../constants';

import { bubbleGeneral, bubbleSuccess, bubbleErr, bubbleWarn } from "./logger";

import { dbDeletionError } from "./messages";

const deleteDatabase = async (name) => {
  const { repo } = await getRepoInfo();
  bubbleGeneral(`Deleting the ${repo}-${name} database...`);

  try {
    await wrapExecCmd(deleteTable(repo, name));
    bubbleSuccess("deleted", `${name} database: `);
  } catch (err) {
    bubbleErr(err);
    bubbleWarn(dbDeletionError(repo, name));
  }
};

export default { deleteDatabase };