const deleteTable = (repoName, tableName) => {
  return `aws dynamodb delete-table --table-name ${repoName}-${tableName} --profile ${repoName}-bubble-user`;
};

module.exports = {
  deleteTable,
};
