const deleteUserAccessKey = (keyId, repo) => {
  return `aws iam delete-access-key --user-name ${repo}-bubble-user --access-key-id ${keyId}`;
};

module.exports = {
  deleteUserAccessKey,
};