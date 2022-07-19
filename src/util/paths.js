import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const rootFrameworkPath = join(__dirname, '/../..');
const templateFolderPath = join(rootFrameworkPath, '/templates');
const githubFolderPath = join(process.cwd(), '/.github');
const workflowFolderPath = join(process.cwd(), '/.github/workflows');

const userDeployReviewAppPath = join(
  workflowFolderPath,
  '/bubble_deploy_preview_app.yml',
);

const userHandleFailedAppPath = join(
  workflowFolderPath,
  '/bubble_log_deploy_error.yml',
);

const userRemovePRAppsPath = join(
  workflowFolderPath,
  '/bubble_remove_branch_preview_apps.yml',
);

const frameworkRemovePRAppsPath = join(
  templateFolderPath,
  '/bubble_remove_branch_preview_apps.yml',
);

const frameworkDeployReviewAppPath = join(
  templateFolderPath,
  '/bubble_deploy_preview_app.yml',
);

const frameworkHandleFailedAppPath = join(
  templateFolderPath,
  '/bubble_log_deploy_error.yml',
);

const userPolicyPath = join(
  rootFrameworkPath,
  '/src/aws/userPolicy.json',
);

const userRemoveAppPath = join(
  workflowFolderPath,
  '/bubble_remove_single_preview_app.yml',
);

const frameworkRemoveAppPath = join(
  templateFolderPath,
  '/bubble_remove_single_preview_app.yml',
);

const userDestroy = join(
  workflowFolderPath,
  '/bubble_remove_all_preview_apps.yml',
);

const frameworkDestroy = join(
  templateFolderPath,
  '/bubble_remove_all_preview_apps.yml',
);

const dataFolderPath = join(process.env.HOME, '/.bubble');
const configPath = join(process.env.HOME, '/.bubble/config.json');
const gitPath = join(process.cwd(), '/.git');
const awsConfigPath = join(process.env.HOME, '/.aws/config');
const awsCredentialsPath = join(process.env.HOME, '/.aws/credentials');
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
