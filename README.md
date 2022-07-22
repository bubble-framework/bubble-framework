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

# Installation

- Run the command `npm i -g jjam-bubble` to globally install Bubble on your machine

# Integrate Bubble with your application

### Setting Up Your Bubble Dashboard

### Setting Up Your IAM User

### Setting Up Your GitHub Actions

### Setting Up Your DynamoDB table

### Pushing Your `./github` folder to your GitHub Repository

# Workflow

# Commands

### `bubble init`

### `bubble detail`

### `bubble list`

### `bubble dashboard`

### `bubble destroy`

### `bubble teardown`

# Troubleshooting
