const { getPreviewAppsDetails } = require('../aws/getPreviewAppsDetails');
const { wrapExecCmd } = require("../util/wrapExecCmd");

const getAppsDetails = async () => {
  const RawAppsDetails = await wrapExecCmd(getPreviewAppsDetails());
  const AppDetails = JSON.parse(RawAppsDetails).Items
  const adjusted = AppDetails.map(item => {
    let commits = item.Commits
    return commits.map(commit => {
      let parsed = {};
      parsed.CloudFrontDistroId = detail.M.CloudFrontDistroId.S;
      parsed.BucketId = detail.M.BucketId.S;
      return parsed;
    })
  })
}


getAppsDetails();
module.exports = { getAppsDetails } 