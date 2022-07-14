const fs = require("fs");
const prompts = require("prompts");

const { wrapExecCmd } = require("./wrapExecCmd");

const {
  githubFolderPath,
  workflowFolderPath,
  userDeployReviewAppPath,
  userHandleFailedAppPath,
  userRemoveAppPath,
  frameworkRemoveAppPath,
  userRemovePRAppsPath,
  frameworkRemovePRAppsPath,
  frameworkDeployReviewAppPath,
  frameworkHandleFailedAppPath,
  userDestroy,
  frameworkDestroy,
  dataFolderPath,
  configPath,
  gitPath
} = require("./paths");

const {
  bubbleSuccess,
  bubbleErr,
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

  bubbleSuccess("created", "Remove single preview app Github action: ");
  
  fs.copyFileSync(frameworkRemovePRAppsPath, userRemovePRAppsPath);

  bubbleSuccess("created", "Remove all preview apps for pull request Github action: ");

  fs.copyFileSync(frameworkDestroy, userDestroy);

  bubbleSuccess("created", "Remove all preview apps for all pull requests Github action: ");
};

const addToken = async () => {
  const question = {
    type: "text",
    name: "githubToken",
    message: `Please provide a valid github access token
 (https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)
 Only 'repo' permission is needed for access token.
 Enter token: `,
  };

  const result = await prompts(question);

  writeToConfigFile({ github_access_token: result["githubToken"] }, configPath, "JSON");
  bubbleSuccess(`saved in ${configPath}`, "Bubble configuration: ");
};

const createConfigFile = async () => {
  createFolder(dataFolderPath);

  if (!fs.existsSync(configPath)) {
    await addToken();
  } else {
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

const readConfigFile = (path, output) => {
  const rawUserAppsConfig = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });

  switch (output) {
    case "JSON":
      return JSON.parse(rawUserAppsConfig);
    default:
      return rawUserAppsConfig;
  }
};

const writeToConfigFile = (config, path, output) => {
  switch (output) {
    case "JSON":
      fs.writeFileSync(path, JSON.stringify(config));
      break;
    default:
      fs.writeFileSync(path, config);
      break;
  };
};

const isRepo = () => {
  if (!fs.existsSync(gitPath)) return false;
  return wrapExecCmd("git config --get remote.origin.url").then((url) => {
    return !!url;
  });
};

const deleteWorkflowFolder = () => {
  fs.rm("./.github", { recursive: true }, (err) => {
    if (err) {
      bubbleErr(err.message);
      return;
    }
    bubbleSuccess("deleted", " Workflow folder:")
  });
};

module.exports = {
  createWorkflowDir,
  copyGithubActions,
  addToken,
  createConfigFile,
  readConfigFile,
  writeToConfigFile,
  isRepo,
  deleteWorkflowFolder,
};