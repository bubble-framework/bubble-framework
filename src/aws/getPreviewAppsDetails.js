const getPreviewAppsDetails = () => {
  return `aws dynamodb scan --table-name color-app-PreviewApps`;
};

module.exports = { getPreviewAppsDetails }