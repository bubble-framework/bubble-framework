const { wrapExecCmd } = require("jjam-bubble/src/util/wrapExecCmd");

async function getRepoInfo() {
  let nameWithOwner = await wrapExecCmd(
    "gh repo view --json nameWithOwner -q '.nameWithOwner'"
  );

  const [ owner, repo ] = nameWithOwner.split('/');
  return { owner, repo };
};

module.exports = { getRepoInfo };
