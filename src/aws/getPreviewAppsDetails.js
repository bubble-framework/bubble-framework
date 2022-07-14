const getPreviewAppsDetails = (repoName) => {
  return `aws dynamodb scan --table-name ${repoName}-PreviewApps`;
};

module.exports = { getPreviewAppsDetails };
