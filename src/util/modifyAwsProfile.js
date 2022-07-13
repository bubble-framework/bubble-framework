const { readConfigFile, writeToConfigFile } = require('./fs');
const { awsConfigPath, awsCredentialsPath } = require('./paths');
const { getRepoInfo } = require('./addGithubSecrets');

const modifyConfig = (id, key) => {
  const { repo } = getRepoInfo();
  let originalConfig = readConfigFile(awsConfigPath);
  let newConfig = `
[profile ${repo}-bubble-user]
region=us-east-1
output=json`
  writeToConfigFile(originalConfig + newConfig, awsConfigPath)
}

modifyConfig();