const getPreviewAppsDetails = (repoName) => {
  return `aws dynamodb scan --table-name ${repoName}-PreviewApps --profile ${repoName}-bubble-user`;
};

module.exports = { getPreviewAppsDetails };
