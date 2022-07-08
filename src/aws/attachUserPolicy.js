const attachUserPolicy = (templatePath) => {
  return `aws iam put-user-policy --user-name bubble-user --policy-name BubblePolicy --policy-document file://src/aws/userPolicy.json`;
};

module.exports = {
  attachUserPolicy,
};
