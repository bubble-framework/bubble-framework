const open = require("open");
const { getExistingApps } = require('../util/getExistingApps');
const prompts = require("prompts");
const {
  bubbleBold
} = require("../util/logger");
const {
  NO_BUBBLES_MSG,
  commandsOutOfOrder
} = require("../util/messages");

const { existingAwsUser } = require("../util/deleteUser");

const list = async () => {
  try {
    if (!existingAwsUser()) {
      throw new Error();
    }

    const apps = await getExistingApps();
    if (apps.length > 0) {
      commitMessages = apps.map(app => app.commit_message);
      const selectList = {
        type: "select",
        name: "commitMessage",
        message: "Select a preview app bubble to go to its url",
        choices: commitMessages,
      };

      const result = await prompts(selectList);
      const choice = commitMessages[result["commitMessage"]];
      const domain = apps.find(app => app.commit_message === choice).url
      return open(domain);
    } else {
      bubbleBold(NO_BUBBLES_MSG);
    }
  } catch {
    bubbleBold(commandsOutOfOrder('list'));
  }
}

module.exports = { list }