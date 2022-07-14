const deleteLambda = (functionName, repoName) => {
  return `aws lambda delete-function --function-name ${functionName} --profile ${repoName}-bubble-user`;
};

module.exports = { deleteLambda }