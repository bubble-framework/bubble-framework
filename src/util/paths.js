const path = require("path");

const rootFrameworkPath = path.join(__dirname, "/../..");
const githubFolderPath = path.join(process.cwd(), "/.github");
const workflowFolderPath = path.join(process.cwd(), "/.github/workflows");

const userDeployReviewAppPath = path.join(
  process.cwd(),
  "/.github/workflows/deploy.yml"
);

const userHandleFailedAppPath = path.join(
  process.cwd(),
  "/.github/workflows/handle_failed_deploy.yml"
);

const frameworkDeployReviewAppPath = path.join(
  rootFrameworkPath,
  `/templates/deploy.yml`
);

const frameworkHandleFailedAppPath = path.join(
  rootFrameworkPath,
  `/templates/handle_failed_deploy.yml`
);

const userPolicyPath = path.join(
  rootFrameworkPath,
  `/src/aws/userPolicy.json`
);

const dataFolderPath = path.join(process.env.HOME, "/.bubble");
const configPath = path.join(process.env.HOME, "/.bubble/config.json");
const gitPath = path.join(process.cwd(), "/.git");

module.exports = {
  githubFolderPath,
  rootFrameworkPath,
  workflowFolderPath,
  userDeployReviewAppPath,
  userHandleFailedAppPath,
  frameworkDeployReviewAppPath,
  frameworkHandleFailedAppPath,
  userPolicyPath,
  dataFolderPath,
  configPath,
  gitPath
};
