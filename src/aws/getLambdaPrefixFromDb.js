const getLambdaPrefixFromDb = (repoName) => {
  return `aws dynamodb scan --table-name ${repoName}-Lambdas --profile ${repoName}-bubble-user`;
};

module.exports = { getLambdaPrefixFromDb }