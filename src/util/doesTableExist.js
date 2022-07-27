import awsService from '../services/awsService.js';
import wrapExecCmd from './wrapExecCmd.js';

const doesTableExist = async (repo, tableName) => {
  let tables = JSON.parse(await wrapExecCmd(awsService.getTableList(repo)));
  const tableNames = tables.TableNames;
  return tableNames.some((name) => tableName === name);
}

export default doesTableExist;
