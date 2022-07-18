// eslint-disable-next-line camelcase
import { ready, crypto_box_seal } from 'libsodium-wrappers';

const encrypt = async (publicKey, secretVal) => {
  await ready;
  const key = publicKey;

  const messageBytes = Buffer.from(secretVal);
  const keyBytes = Buffer.from(key, 'base64');

  const encryptedBytes = crypto_box_seal(messageBytes, keyBytes);

  const encrypted = Buffer.from(encryptedBytes).toString('base64');
  return encrypted;
};

export default { encrypt };
