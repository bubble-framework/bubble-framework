const TABLE_NAME = 'PreviewApps';
const PARTITION_KEY = 'PullRequestId';

const awsService = {
  attachUserPolicy: (templatePath, repo) => (
    `aws iam put-user-policy --user-name ${repo}-bubble-user --policy-name BubblePolicy --policy-document file://${templatePath}`
  ),

  checkExistingUser: (repo) => (
    `aws iam get-user --user-name ${repo}-bubble-user`
  ),

  createAccessKey: (repo) => (
    `aws iam create-access-key --user-name ${repo}-bubble-user`
  ),

  createDynamoTable: (repo) => (
    `aws dynamodb create-table --attribute-definitions AttributeName=${PARTITION_KEY},AttributeType=N --table-name ${repo}-${TABLE_NAME} --key-schema AttributeName=${PARTITION_KEY},KeyType=HASH --billing-mode PAY_PER_REQUEST --profile ${repo}-bubble-user`
  ),

  createUser: (repo) => (
    `aws iam create-user --user-name ${repo}-bubble-user`
  ),

  deleteLambda: (functionName, repo) => (
    `aws lambda delete-function --function-name ${functionName} --profile ${repo}-bubble-user`
  ),

  deleteTable: (repo, tableName) => (
    `aws dynamodb delete-table --table-name ${repo}-${tableName} --profile ${repo}-bubble-user`
  ),

  deleteUser: (repo) => (
    `aws iam delete-user --user-name ${repo}-bubble-user`
  ),

  deleteUserAccessKey: (keyId, repo) => (
    `aws iam delete-access-key --user-name ${repo}-bubble-user --access-key-id ${keyId}`
  ),

  deleteUserPolicy: (repo) => (
    `aws iam delete-user-policy --user-name ${repo}-bubble-user --policy-name BubblePolicy`
  ),

  getLambdaFunctions: (prefix, repo) => (
    `aws lambda list-functions --region us-east-1 --query "Functions[?starts_with(FunctionName, '${prefix}')].FunctionName" --output text --profile ${repo}-bubble-user`
  ),

  getLambdaPrefixFromDb: (repo) => (
    `aws dynamodb scan --table-name ${repo}-Lambdas --profile ${repo}-bubble-user`
  ),

  getPreviewAppsDetails: (repo) => (
    `aws dynamodb scan --table-name ${repo}-PreviewApps --profile ${repo}-bubble-user`
  ),

  getUserAccessKey: (repo) => (
    `aws iam list-access-keys --user-name ${repo}-bubble-user`
  ),

  getTableList: (repo) => (
    `aws dynamodb list-tables --profile ${repo}-bubble-user`
  ),
};

export default awsService;
