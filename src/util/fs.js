const fs = require("fs");
const prompts = require("prompts");

const {
  githubFolderPath,
  workflowFolderPath,
  userDeployReviewAppPath,
  userHandleFailedAppPath,
  frameworkDeployReviewAppPath,
  frameworkHandleFailedAppPath
} = require("./paths");

const {
  bubbleSuccess
} = require("./logger");

const createFolder = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    bubbleSuccess(path, "Bubble folder created: ");
  }
};

const createWorkflowDir = () => {
  createFolder(githubFolderPath);
  createFolder(workflowFolderPath);
};

const copyGithubActions = () => {
  fs.copyFileSync(frameworkDeployReviewAppPath, userDeployReviewAppPath);

  bubbleSuccess("created", "Create review app Github action: ");

  fs.copyFileSync(frameworkHandleFailedAppPath, userHandleFailedAppPath);

  bubbleSuccess("created", "handle failed review app Github action: ");
};

module.exports = {
  createWorkflowDir,
  copyGithubActions,
};