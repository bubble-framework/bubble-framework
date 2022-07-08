const deleteUserPolicy = (repo) => {
  return `aws iam delete-user-policy --user-name ${repo}-bubble-user --policy-name BubblePolicy`;
};

module.exports = {
  deleteUserPolicy,
};