const { wrapExecCmd } = require("./util/wrapExecCmd");

async function getRepoInfo() {
  let nameWithOwner = await wrapExecCmd(
    "git config --get remote.origin.url"
  );

  const parts = nameWithOwner.split("/");
  const owner = parts[parts.length - 2];
  const repo = parts[parts.length - 1].split(".")[0];

  return { owner, repo };
};

module.exports = { getRepoInfo };
