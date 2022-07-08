const checkExistingUser = (repo) => {
  return `aws iam get-user --user-name ${repo}-bubble-user`;
};

module.exports = {
  checkExistingUser
};