const deleteTable = (repo) => {
  return `aws dynamodb delete-table --table-name ${repo}-PreviewApps`;
};

module.exports = {
  deleteTable,
};
