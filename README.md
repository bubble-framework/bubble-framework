<p align="center">
  <img src="<link to logo image when ready>" width="500" height="200" />
</p>

<h1 align="center">:large_blue_circle: Bubble: Automated open-source solution for deploying dynamic frontend preview apps :large_blue_circle:</h1>
<h2 align="center">Have a Next.js application, AWS account and GitHub repo? Then you're ready to start blowing some bubbles! :bathtub:</h2>

Bubble is an open-source solution that provides preview apps for applications built with the Next.js framework. We automate the provisioning, management, and teardown of preview app resources on your own AWS account, allowing you to maintain full control over your source code and self-hosted infrastructure.

To learn more, please read our [case study](<link to case study>).

[![Version](https://img.shields.io/npm/v/fleet-cli.svg)](https://www.npmjs.com/package/jjam-bubble)

---

# Table of Contents

- [Prerequisites](#prerequisites)
- [Bubble Lingo](#bubble-lingo)
- [Installation](#installation)
- [Integrate Bubble With Your Application](#integrate-bubble-with-your-application)
- [Workflow](#workflow)
- [Commands](#commands)
- [Troubleshooting](#troubleshooting)

# Prerequisites

- AWS Account + AWS CLI configured to your account
  - Check out [this guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) for instructions on installing the AWS CLI
- GitHub Token
  - Check out [this guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for instructions on creating a personal access token
  - You only need to grant the token access to `repos`
- Node
- NPM
- GitHub Repository for an application built with Next.js

### Adding environment variables

- If your application references environment variables that you don't want exposed in your GitHub repo, add these to your GitHub repository secrets
  - Navigate to the main page of your repository => Settings tab
  - Click Secrets on the left sidebar => Actions => New repository secret

##### _For Example:_

- If your app requires connection to a database, the connection must be made via external API. In this case, you may likely wish to store your URI connection string and database name as environment variables for more security
- An example of what the `next.config.js` file in your application may look like:

```
module.exports = {
  env: {
    DB_URI: process.env.DB_URI,
    DB_NAME: process.env.DB_NAME
  }
};
```

- You would thus navigate to your GitHub repository secrets, and save one secret named `DB_URI` and another named `DB_NAME` with the appropriate values. These secrets will be provided to a `.env` file when your preview apps are being built and deployed.

# Bubble Lingo

- Before we get started, a quick rundown on Bubble lingo you will encounter while using our framework:
  - Bubble = a preview app
  - Bubble Bath = all preview apps across your repo
  - Blowing a Bubble = deploying a preview app
  - Popping a Bubble = tearing down a preview app
- And that's it! You're all set to start filling up your bubble bath! :wink:

# Installation

- Run the command `npm i -g jjam-bubble` to globally install Bubble on your machine

# Integrate Bubble with your application

- Navigate to the root of your project directory
- Ensure it is connected with a GitHub repository and that the [remote URL is set to HTTPS](https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories#switching-remote-urls-from-ssh-to-https)
- Run `bubble init`
- Provide your GitHub Personal Access Token (after providing this the very first time you ever run `bubble init` in any project, you may continue to use the same token for subsequent Bubble-integrated projects)
- A folder named `/ .bubble` will be created in your home directory to house your configuration details and data on all active Bubble-integrated repos
- Your GitHub token will be saved in the configuration file, as well as in your GitHub repository secrets under `BUBBLE_GITHUB_TOKEN`

### Setting Up Your Bubble Dashboard

- We provide a dashboard feature as a user-friendly interface for managing your bubbles across repos
- The first time you ever run `bubble init` in any project, the code for this dashboard will be saved in your home directory's `.bubble/bubble-dashboard` folder, and all necessary packages required for the dashboard to run successfully will be installed

### Setting Up Your AWS IAM User

- Every time you run `bubble init` in a new repo, we create IAM user credentials that have strict permissions in order to enable secure access to your provisioned bubble resources
- This new IAM user will be named `{repo-name}-bubble-user`, and its credentials will be stored locally in `.aws/credentials` within your home directory, as well as encrypted within your GitHub repository secrets under `BUBBLE_AWS_ACCESS_KEY_ID` and `BUBBLE_AWS_SECRET_ACCESS_KEY`

### Setting Up Your GitHub Actions

- Next, a `.github/workflows` folder will be created in your project directory
- This folder will house the following customized GitHub Actions workflow files. This allows us to automate the processes of deploying and destroying your bubbles:
  - `bubble_deploy_preview_app.yml` for blowing a single bubble on pull request
  - `bubble_log_deploy_error.yml` for handling a failed attempt at blowing a bubble
  - `bubble_remove_single_preview_app.yml`for popping a single bubble
  - `bubble_remove_branch_preview_apps.yml` for popping all bubbles associated with a particular pull request
  - `bubble_remove_all_preview_apps.yml` for popping all bubbles across all branches of a repository

### Setting Up Your DynamoDB table

- Finally, in order to keep track of your bubbles and their associated set of AWS resources in your repo, we spin up a new DynamoDB table named `{repo-name}-PreviewApps`

### Pushing Your `./github` folder to your GitHub Repository

- As a last step, please ensure the `./github` folder is pushed to your repository's `main` branch. The Bubble-generated GitHub Actions workflow files must be present on this branch for successful automation of the bubble process

# Workflow

- Every time you open a new Pull Request in your GitHub repo, or push a change to an existing Pull Request, the Bubble-generated workflow will blow a new bubble for you. The first time this occurs, a `${repo-name}-Lambdas` DynamoDB table will be provisioned with your Bubble-created IAM credentials in order to keep track of Lambdas associated with each bubble. This will be useful when you initiate teardown of your bubbles in the future.
- You may view the deployment progress within each Pull Request in your GitHub repository. The shareable URL for your new bubble will be displayed once ready
- You may also view the build logs of bubble deployment and removal workflows in the Actions tab of your GitHub repository.
- When a Pull Request is closed or merged, Bubble will automatically pop all bubbles associated with that particular Pull Request. You may also manually pop all bubbles across your entire repository with the `bubble destroy` CLI command or through the dashboard.

# Commands

- [`bubble init`](#bubble-init)
- [`bubble detail`](#bubble-detail)
- [`bubble list`](#bubble-list)
- [`bubble dashboard`](#bubble-dashboard)
- [`bubble destroy`](#bubble-destroy)
- [`bubble teardown`](#bubble-teardown)

### `bubble init`

- Initializes Bubble in your project repository
- This command only needs to be run once per project repo. Run it from the root directory of your repository, and follow along with the prompts for information on each step of the initialization process as it occurs
- See [Integrate Bubble With Your Application](#integrate-bubble-with-your-application) above for more details on the `bubble init` process

_See code: [src/commands/init.js](https://github.com/jjam-bubble/bubble-framework/blob/main/src/commands/init.js)_

### `bubble detail`

- Displays bubbles for all active Pull Requests in your repository in a table format
- Includes the commit id, commit message, creation timestamp, and bubble URL for each Pull Request
- You may open the URL for each bubble in your browser by Cmd/Ctrl + double-clicking

_See code: [src/commands/detail.js](https://github.com/jjam-bubble/bubble-framework/blob/main/src/commands/detail.js)_

### `bubble list`

- Displays bubbles for all active Pull Requests in your repository in a navigable format
- A list of the commit messages for each bubble will be displayed
- Navigate using your arrow keys and press enter to select and open the URL for the desired bubble in your browser

_See code: [src/commands/list.js](https://github.com/jjam-bubble/bubble-framework/blob/main/src/commands/list.js)_

### `bubble dashboard`

- Provides a user-friendly interface for most of the functionality of the CLI tool, and allows you to visually manage all your bubbles in one place
- Upon running this command, you will be provided with a URL at which you can view the dashboard locally (`http://localhost:3000/${repo-name}`). Cmd/Ctrl + double-click on the link to open up in the browser
- You will automatically be taken to a page displaying the commit id, commit message, creation timestamp, and link to all bubbles associated with the repo from which you've run this command. You will also be able to view the build logs from the deployment of each bubble.
- If the bubbles in your repo are still active, you may click the Destroy App button in order to pop all bubbles in the repo. This effectively provides the same functionality as directly executing `bubble destroy` from the terminal
- If you have already destroyed your repo, you will have the option to Teardown App from the dashboard. This effectively provides the same functionality as directly executing `bubble teardown` from the terminal
- There will also be a sidebar where you may view all active Bubble-integrated repos, to which you can navigate in order to view and manage those projects' bubbles
- Press Ctrl + C in your terminal to exit out of the dashboard

_See code: [src/commands/dashboard.js](https://github.com/jjam-bubble/bubble-framework/blob/main/src/commands/dashboard.js)_

### `bubble destroy`

- Tears down resources for all bubbles across your project repository
- This command will remove:
  - AWS infrastructure, including the CloudFront distributions, S3 buckets, and Lambdas provisioned for each bubble. Lambda functions often require additional wait time before they are able to be deleted, so the `bubble teardown` command should be executed a day or two after `bubble destroy` in order to remove any remaining Lambdas
  - `{repo-name}-PreviewApps DynamoDB table that was used to track all the bubbles in your repo
  - Bubble-related workflow files in your local project directory's `.github` folder
  - You may now also choose to manually remove the `.github` folder from the `main` branch of your GitHub repository

_See code: [src/commands/destroy.js](https://github.com/jjam-bubble/bubble-framework/blob/main/src/commands/destroy.js)_

### `bubble teardown`

- Tears down remaining Lambdas associated with bubbles, and any final traces of Bubble in your project repository
- This command will remove:

  - Remaining Lambda functions that were not able to be deleted during `bubble destroy`. During this step, you may receive a message informing you that some Lambdas are still not ready to be deleted yet. If that is the case, the following pieces will not yet be removed, and you should wait at least a few hours before trying `bubble teardown` again
  - `{repo-name}-Lambdas DynamoDB table that was used to track all Lambdas for every bubble in your repo
  - Bubble-created AWS IAM user
  - GitHub repository secrets `BUBBLE_GITHUB_TOKEN`, `BUBBLE_AWS_ACCESS_KEY_ID` and `BUBBLE_AWS_SECRET_ACCESS_KEY` that were saved by Bubble during the initialization process
  - Project-related information from your local machine's `.bubble` datastore

_See code: [src/commands/teardown.js](https://github.com/jjam-bubble/bubble-framework/blob/main/src/commands/teardown.js)_

# Troubleshooting
