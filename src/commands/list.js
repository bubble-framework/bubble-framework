const open = require("open");
const { getExistingApps } = require('../util/getExistingApps');
const prompts = require("prompts");

const list = async () => {
  const apps = await getExistingApps()
  commitMessages = apps.map(app => app.commit_message);
  const selectList = {
    type: "select",
    name: "commitMessage",
    message: "Select a preview app to go to its url",
    choices: commitMessages,
  };

  const result = await prompts(selectList);
  const choice = commitMessages[result["commitMessage"]];
  const domain = apps.find(app => app.commit_message === choice).url
  return open(domain);
}

module.exports = { list }