const createAccessKey = () => {
  return `aws iam create-access-key --user-name bubble-user`;
};

module.exports = {
  createAccessKey,
};
