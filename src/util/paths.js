import path from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rootFrameworkPath = path.join(__dirname, '/../..');
const templateFolderPath = path.join(rootFrameworkPath, '/templates');
const githubFolderPath = path.join(process.cwd(), '/.github');
const workflowFolderPath = path.join(process.cwd(), '/.github/workflows');

const userDeployReviewAppPath = path.join(
  workflowFolderPath,
  '/bubble_deploy_preview_app.yml',
);

const userHandleFailedAppPath = path.join(
  workflowFolderPath,
  '/bubble_log_deploy_error.yml',
);

const userRemovePRAppsPath = path.join(
  workflowFolderPath,
  '/bubble_remove_branch_preview_apps.yml',
);

const frameworkRemovePRAppsPath = path.join(
  templateFolderPath,
  '/bubble_remove_branch_preview_apps.yml',
);

const frameworkDeployReviewAppPath = path.join(
  templateFolderPath,
  '/bubble_deploy_preview_app.yml',
);

const frameworkHandleFailedAppPath = path.join(
  templateFolderPath,
  '/bubble_log_deploy_error.yml',
);

const userPolicyPath = path.join(
  rootFrameworkPath,
  '/src/aws/userPolicy.json',
);

const userRemoveAppPath = path.join(
  workflowFolderPath,
  '/bubble_remove_single_preview_app.yml',
);

const frameworkRemoveAppPath = path.join(
  templateFolderPath,
  '/bubble_remove_single_preview_app.yml',
);

const userDestroy = path.join(
  workflowFolderPath,
  '/bubble_remove_all_preview_apps.yml',
);

const frameworkDestroy = path.join(
  templateFolderPath,
  '/bubble_remove_all_preview_apps.yml',
);

const dataFolderPath = path.join(process.env.HOME, '/.bubble');
const configPath = path.join(process.env.HOME, '/.bubble/config.json');
const gitPath = path.join(process.cwd(), '/.git');
const awsConfigPath = path.join(process.env.HOME, '/.aws/config');
const awsCredentialsPath = path.join(process.env.HOME, '/.aws/credentials');
const activeReposPath = path.join(process.env.HOME, '/.bubble/activeRepos.json');
const bubbleDashboardRootFolderPath = path.join(process.env.HOME, '/.bubble/bubble-dashboard');
const bubbleDashboardClientFolderPath = path.join(process.env.HOME, '/.bubble/bubble-dashboard/client');
const bubbleDashboardServerFolderPath = path.join(process.env.HOME, '/.bubble/bubble-dashboard/server');

export {
  githubFolderPath,
  rootFrameworkPath,
  workflowFolderPath,
  userDeployReviewAppPath,
  userHandleFailedAppPath,
  userRemovePRAppsPath,
  frameworkRemovePRAppsPath,
  frameworkDeployReviewAppPath,
  frameworkHandleFailedAppPath,
  userRemoveAppPath,
  frameworkRemoveAppPath,
  userDestroy,
  frameworkDestroy,
  userPolicyPath,
  dataFolderPath,
  configPath,
  activeReposPath,
  bubbleDashboardRootFolderPath,
  bubbleDashboardClientFolderPath,
  bubbleDashboardServerFolderPath,
  gitPath,
  awsConfigPath,
  awsCredentialsPath,
};
