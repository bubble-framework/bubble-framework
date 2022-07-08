const createAccessKey = (repo) => {
  return `aws iam create-access-key --user-name ${repo}-bubble-user`;
};

module.exports = {
  createAccessKey,
};
