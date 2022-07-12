const { getPreviewAppsDetails } = require('../aws/getPreviewAppsDetails');
const { wrapExecCmd } = require("../util/wrapExecCmd");

/*
P
  Need to access the DistributionConfig.CacheBehaviors.Items array inside the object which will be returned by the aws call

  (JSON.parse first)

  NOTES:
    Handle network error and bad/empty responses
    Is it possible there may be a deployment with no lambdas?

A
  Return the result of mapping input array to its original element plus the following (for each element):
      Call AWS get-distribution-config service using the value of the CloudFrontDistroId property and save the response after parsing its JSON

      Initialize a variable cacheItems to point to the array contained inside RootObject.DistributionConfig.CacheBehaviors.Items

      Return the result of reducing the array cacheItems points to to an array of LambdaFunction ARNs

*/
const parseCloudfrontAndS3Ids = (repoAppsInfo) => {
  return repoAppsInfo.flatMap(pullRequest => {
    return pullRequest.Commits.L.map(previewApp => {
      let parsed = {};
      parsed.CloudFrontDistroId = previewApp.M.CloudFrontDistroId.S;
      parsed.BucketId = previewApp.M.BucketId.S;
      return parsed;
    });
  });
};

const getAppsDetails = async (repoName) => {
  const rawAppsDetails = await wrapExecCmd(getPreviewAppsDetails(repoName));

  const appDetails = JSON.parse(rawAppsDetails).Items;

  const cloudfrontAndS3Info = parseCloudfrontAndS3Ids(appDetails);
};


getAppsDetails();
module.exports = { getAppsDetails };
