const { getPreviewAppsDetails } = require('../aws/getPreviewAppsDetails');
const { wrapExecCmd } = require("../util/wrapExecCmd");
const { getCloudfrontConfig } = require('../aws/getCloudfrontConfig');

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

const unique = (array) => array.filter((value, index, arr) => arr.indexOf(value) === index);

const getLambdaARNs = (cloudfrontDetails) => {
  const cacheItems = cloudfrontDetails.DistributionConfig.CacheBehaviors.Items;

  const reduced = cacheItems.reduce((memo, item) => {
    const lambdas = item.LambdaFunctionAssociations;

    console.log(memo);

    if (lambdas.Quantity > 0) {
      memo.push(...lambdas.Items.map(item => {
        return item.LambdaFunctionARN;
      }));

      return memo;
    } else {
      return memo;
    }
  }, []);

  console.log('reduced unique:', unique(reduced));
};

const getAppsDetails = async (repoName) => {
  // const rawAppsDetails = await wrapExecCmd(getPreviewAppsDetails(repoName));

  // const appDetails = JSON.parse(rawAppsDetails).Items;

  // const cloudfrontAndS3Info = parseCloudfrontAndS3Ids(appDetails);

  const cloudfrontConfig = JSON.parse(await wrapExecCmd(getCloudfrontConfig('E13I3Z6MZPC7XC')));

  getLambdaARNs(cloudfrontConfig);

};


getAppsDetails();
module.exports = { getAppsDetails };
