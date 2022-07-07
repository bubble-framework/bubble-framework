const prompts = require("prompts");

const {
  createWorkflowDir,
  copyGithubActions,
} = require("../util/fs");

const {
  bubbleErr
} = require("../util/logger");

const init = async (args) => {
  try {
    createWorkflowDir();
    copyGithubActions();
  } catch (err) {
    bubbleErr(`Could not initialize app:\n${err}`);
  }
};

module.exports = { init };