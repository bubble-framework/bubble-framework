const getPreviewAppsDetails = (repoName) => {
  const tableName = repoName ? `${repoName}-PreviewApps` : 'color-app-PreviewApps';

  return `aws dynamodb scan --table-name ${tableName}`;
};

module.exports = { getPreviewAppsDetails };
