const createUser = () => {
  return `aws iam create-user --user-name bubble-user`;
};

module.exports = {
  createUser,
};
