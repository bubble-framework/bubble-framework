const { wrapExecCmd } = require("./wrapExecCmd");

const repoInfo = await (async function getRepoInfo() {
  let remote = await wrapExecCmd("git config --get remote.origin.url");

  const parts = remote.split("/");
  const owner = parts[parts.length - 2];
  const repo = parts[parts.length - 1].slice(0, -5);

  return { owner, repo };
})();

module.exports = { repoInfo };