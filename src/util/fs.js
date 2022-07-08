const fs = require("fs");
const prompts = require("prompts");

const { wrapExecCmd } = require("./wrapExecCmd");

const {
  githubFolderPath,
  workflowFolderPath,
  userDeployReviewAppPath,
  userHandleFailedAppPath,
  userRemoveAppPath,
  frameworkDeployReviewAppPath,
  frameworkHandleFailedAppPath,
  frameworkRemoveAppPath,
  dataFolderPath,
  configPath,
  gitPath
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

  bubbleSuccess("created", "Handle failed review app Github action: ");

  fs.copyFileSync(frameworkRemoveAppPath, userRemoveAppPath);

  bubbleSuccess("created", "Remove preview app Github action: ");
};

const addToken = async () => {
  const question = {
    type: "text",
    name: "githubToken",
    message: `Please provide a valid github access token
 (https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)
 Only permission for access token needed is repo.
 Enter token: `,
  };

  const result = await prompts(question);

  writeToConfigFile({ github_access_token: result["githubToken"] });
  bubbleSuccess("saved", "Bubble configuration: ");
};

const createConfigFile = async () => {
  createFolder(dataFolderPath);

  if (!fs.existsSync(configPath)) {
    await addToken();
  } else {
    let github_access_token = readConfigFile().github_access_token;

    const question = {
      type: "confirm",
      name: "useToken",
      message: `Would you like to use existing Github config token?`,
      initial: true,
    };

    const result = await prompts(question);

    if (!result.useToken) {
      await addToken();
    }
  }
};

const readConfigFile = () => {
  const rawUserAppsConfig = fs.readFileSync(configPath);
  return JSON.parse(rawUserAppsConfig);
};

const writeToConfigFile = (config) => {
  fs.writeFileSync(configPath, JSON.stringify(config));
};

const isRepo = () => {
  if (!fs.existsSync(gitPath)) return false;
  return wrapExecCmd("git config --get remote.origin.url").then((url) => {
    return !!url;
  });
};

module.exports = {
  createWorkflowDir,
  copyGithubActions,
  addToken,
  createConfigFile,
  readConfigFile,
  writeToConfigFile,
  isRepo
};