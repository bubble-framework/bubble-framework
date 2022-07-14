const getLambdaFunctions = (prefix, repoName) => {
  return `aws lambda list-functions --region us-east-1 --query "Functions[?starts_with(FunctionName, '${prefix}')].FunctionName" --output text --profile ${repoName}-bubble-user`;
};

module.exports = { getLambdaFunctions }