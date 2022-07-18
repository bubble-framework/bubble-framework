const sodium = require("libsodium-wrappers");

const encrypt = async (publicKey, secretVal) => {
  await sodium.ready;
  const key = publicKey;

  const messageBytes = Buffer.from(secretVal);
  const keyBytes = Buffer.from(key, "base64");

  const encryptedBytes = sodium.crypto_box_seal(messageBytes, keyBytes);

  const encrypted = Buffer.from(encryptedBytes).toString("base64");
  return encrypted;
};

module.exports = { encrypt };