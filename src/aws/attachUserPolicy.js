const attachUserPolicy = (templatePath, repo) => {
  return `aws iam put-user-policy --user-name ${repo}-bubble-user --policy-name BubblePolicy --policy-document file://node_modules/jjam-bubble/src/aws/userPolicy.json`;
};

module.exports = {
  attachUserPolicy,
};