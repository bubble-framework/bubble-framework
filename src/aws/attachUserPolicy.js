const attachUserPolicy = (templatePath, repo) => {
  return `aws iam put-user-policy --user-name ${repo}-bubble-user --policy-name BubblePolicy --policy-document file://${templatePath}`;
};

module.exports = {
  attachUserPolicy,
};