const deleteUser = (repo) => {
  return `aws iam delete-user --user-name ${repo}-bubble-user`;
};

module.exports = {
  deleteUser,
};
