const getUserAccessKey = (repo) => {
  return `aws iam list-access-keys --user-name ${repo}-bubble-user`;
};

module.exports = {
  getUserAccessKey,
};