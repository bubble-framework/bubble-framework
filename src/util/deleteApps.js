const { getPreviewAppsDetails } = require('../aws/getPreviewAppsDetails');
const { wrapExecCmd } = require("../util/wrapExecCmd");

const getAppsDetails = async () => {
  const RawAppsDetails = await wrapExecCmd(getPreviewAppsDetails());
  const AppDetails = JSON.parse(RawAppsDetails).Items[0].Commits.L.M
  const adjusted = AppDetails.map(detail => {
    let new = {};
    new.CloudFrontDistroId = detail.M.CloudFrontDistroId;
    new.BucketId = detail.M.BucketId;
    return new;
  })
  console.log(adjusted)
}
/*
  [{CloudFrontDistroId, BucketId}. {cloudfrontId, BucketId}]
  [{CloudFrontDistroId, BucketId, [lambda name, lambda name]}]
*/

getAppsDetails();
module.exports = { getAppsDetails } 