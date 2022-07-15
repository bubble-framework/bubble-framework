const { wrapExecCmd } = require("./util/wrapExecCmd");

async function getRepoInfo() {
  let nameWithOwner = await wrapExecCmd(
    "gh repo view --json nameWithOwner -q '.nameWithOwner'"
  );

  const [ owner, repo ] = nameWithOwner.split('/');
  return { owner, repo };
};

const repoInfo = await getRepoInfo();

module.exports = { repoInfo };