const createUser = (repo) => {
  return `aws iam create-user --user-name ${repo}-bubble-user`;
};

module.exports = {
  createUser,
};
