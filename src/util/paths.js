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

const userRemoveAppPath = path.join(
  process.cwd(),
  "/.github/workflows/remove_preview_app.yml"
);

const frameworkRemoveAppPath = path.join(
  rootFrameworkPath,
  `/templates/delete_preview_app.yml`
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
const awsConfigPath = path.join(process.env.HOME, "/.aws/config")
const awsCredentialsPath = path.join(process.env.HOME, "/.aws/credentials")

module.exports = {
  githubFolderPath,
  rootFrameworkPath,
  workflowFolderPath,
  userDeployReviewAppPath,
  userHandleFailedAppPath,
  userRemoveAppPath,
  frameworkDeployReviewAppPath,
  frameworkHandleFailedAppPath,
  frameworkRemoveAppPath,
  userPolicyPath,
  dataFolderPath,
  configPath,
  gitPath,
  awsConfigPath,
  awsCredentialsPath,
};
