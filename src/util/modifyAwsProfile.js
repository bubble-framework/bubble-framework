import { readConfigFile, writeToConfigFile } from './fs.js';
import { awsConfigPath, awsCredentialsPath } from './paths.js';

const modifyConfig = (repo) => {
  const originalConfig = readConfigFile(awsConfigPath);
  const newConfig = `
[profile ${repo}-bubble-user]
region = us-east-1
output = json`;
  writeToConfigFile(originalConfig + newConfig, awsConfigPath);
};

const modifyCredentials = (id, key, repo) => {
  const originalConfig = readConfigFile(awsCredentialsPath);
  const newConfig = `
[${repo}-bubble-user]
aws_access_key_id = ${id}
aws_secret_access_key = ${key}`;
  writeToConfigFile(originalConfig + newConfig, awsCredentialsPath);
};

export { modifyConfig, modifyCredentials };
