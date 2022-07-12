const TABLE_NAME = 'PreviewApps';
const PARTITION_KEY = 'PullRequestId';

const createDynamoTable = (repoName) => {
  return `aws dynamodb create-table --attribute-definitions AttributeName=${PARTITION_KEY},AttributeType=N --table-name ${repoName}-${TABLE_NAME} --key-schema AttributeName=${PARTITION_KEY},KeyType=HASH --billing-mode PAY_PER_REQUEST`;
};

module.exports = {
  createDynamoTable,
};
