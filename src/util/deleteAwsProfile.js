const { readConfigFile, writeToConfigFile } = require('./fs');
const { awsConfigPath, awsCredentialsPath } = require('./paths');

const deleteConfig = (repo) => {
  const originalConfig = readConfigFile(awsConfigPath);
  let arr = originalConfig.split('\n');
  let idx = arr.indexOf(`[profile ${repo}-bubble-user]`);
  arr.splice(idx, 3);
  writeToConfigFile(arr.join("\n"), awsConfigPath);
}

const deleteCredentials = (repo) => {
  const originalConfig = readConfigFile(awsCredentialsPath);
  let arr = originalConfig.split('\n');
  let idx = arr.indexOf(`[${repo}-bubble-user]`);
  arr.splice(idx, 3);
  writeToConfigFile(arr.join("\n"), awsCredentialsPath);
}

module.exports = { deleteConfig, deleteCredentials };
