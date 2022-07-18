const { wrapExecCmd } = require("./util/wrapExecCmd");

async function getRepoInfo() {
  let nameWithOwner = await wrapExecCmd(
    "gh repo view --json nameWithOwner -q '.nameWithOwner'"
  );

  const [ owner, repo ] = nameWithOwner
    .trim()
    .split('/');
  
  return { owner, repo };
};

module.exports = { getRepoInfo };
