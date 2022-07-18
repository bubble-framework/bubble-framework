import { readConfigFile, writeToConfigFile } from './fs';
import { awsConfigPath, awsCredentialsPath } from './paths';

export const deleteConfig = (repo) => {
  const originalConfig = readConfigFile(awsConfigPath);

  const configLines = originalConfig.split('\n');
  const firstBubbleIdx = configLines.indexOf(`[profile ${repo}-bubble-user]`);
  configLines.splice(firstBubbleIdx, 3);

  writeToConfigFile(configLines.join('\n'), awsConfigPath);
};

export const deleteCredentials = (repo) => {
  const originalConfig = readConfigFile(awsCredentialsPath);

  const configLines = originalConfig.split('\n');
  const firstBubbleIdx = configLines.indexOf(`[${repo}-bubble-user]`);
  configLines.splice(firstBubbleIdx, 3);

  writeToConfigFile(configLines.join('\n'), awsCredentialsPath);
};
