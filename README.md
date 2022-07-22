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
- This folder will house the following GitHub Actions workflow files. This allows us to automate the processes of deploying and destroying your bubbles:
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

-

# Commands

### `bubble init`

### `bubble detail`

### `bubble list`

### `bubble dashboard`

### `bubble destroy`

### `bubble teardown`

# Troubleshooting
