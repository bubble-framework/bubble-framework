const getCloudfrontConfig = (cloudfrontId) => {
  return `aws cloudfront get-distribution-config --id ${cloudfrontId}`;
};

module.exports = { getCloudfrontConfig };
