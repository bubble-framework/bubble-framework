import { getPublicKey, addGithubSecret } from '../services/githubService';
import { bubbleSuccess } from './logger';

async function addGithubSecrets(secrets) {
  const { data: publicKeyObj } = await getPublicKey();
  bubbleSuccess('retrieved', 'Public key:');

  await Promise.all(Object.keys(secrets).forEach(async (secretName) => {
    const secretVal = secrets.secretName;
    await addGithubSecret(secretName, secretVal, publicKeyObj);
  }));
}

function checkBubbleAwsSecretsAdded(currentSecrets) {
  const secretNames = currentSecrets.data.secrets.map((secretObj) => secretObj.name);
  const bubbleSecretNames = [
    'BUBBLE_AWS_ACCESS_KEY_ID',
    'BUBBLE_AWS_SECRET_ACCESS_KEY',
  ];

  return bubbleSecretNames.every((bubbleSecretName) => (
    secretNames.includes(bubbleSecretName)
  ));
}

function checkNonBubbleAwsSecretsAdded(currentSecrets) {
  const secretNames = currentSecrets.data.secrets.map((secretObj) => secretObj.name);
  const awsSecretNames = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
  ];

  return awsSecretNames.every((awsSecretName) => (
    secretNames.includes(awsSecretName)
  )) && !checkBubbleAwsSecretsAdded(currentSecrets);
}

export {
  addGithubSecrets,
  checkBubbleAwsSecretsAdded,
  checkNonBubbleAwsSecretsAdded,
};
