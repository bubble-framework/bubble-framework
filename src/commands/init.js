const { wrapExecCmd } = require("../util/wrapExecCmd");

const { createUser } = require("../aws/createUser");
const { createAccessKey } = require("../aws/createAccessKey");
const { attachUserPolicy } = require("../aws/attachUserPolicy");
const { createDynamoTable } = require("../aws/createDynamoTable");
const { getRepoInfo } = require('../util/addGithubSecrets');

const {
  addGithubSecrets,
  validateGithubConnection,
  retrieveCurrentSecrets,
  checkBubbleAwsSecretsAdded,
  checkNonBubbleAwsSecretsAdded
} = require("../util/addGithubSecrets");

const { getGitHubToken } = require('../util/deleteApps');

const {
  modifyConfig,
  modifyCredentials,
} = require('../util/modifyAwsProfile');

const {
  createWorkflowDir,
  copyGithubActions,
  createConfigFile,
  isRepo
} = require("../util/fs");

const {
  bubbleErr,
  bubbleSuccess,
  bubbleWarn,
  bubbleBold,
  bubbleHelp
} = require("../util/logger");

const {
  INIT_FINISHED_MSG,
  WAIT_FOR_DB_MSG,
  WAIT_FOR_DB_JOKE_DRUM,
  DB_CREATED_MSG,
  DB_NOT_CREATED_MSG,
  randomJokeSetup,
  waitForJokeSetup,
  waitForJokePunchline,
  waitForDBJokeCrickets,
  duplicateBubbleInit
} = require("../util/messages");

const { existingAwsUser } = require("../util/deleteUser");

const { userPolicyPath } = require("../util/paths");

const init = async (args) => {
  try {
    if (!isRepo()) {
      throw `Please make sure the current directory is a git repository or is tied to a GitHub Origin, then re-run \`bubble init\`!`;
    }

    const { repo } = await getRepoInfo();

    if (await existingAwsUser()) {
      bubbleBold(`${duplicateBubbleInit(repo)}`);
      return;
    }

    bubbleBold('Welcome to the Bubble CLI!\n');
    bubbleHelp('Before we get started, please make sure you have your AWS credentials configured with AWS CLI.\n');

    await createConfigFile();
    await validateGithubConnection();

    const currentSecrets = await retrieveCurrentSecrets();
    const nonBubbleAwsSecretsAlreadyAdded = checkNonBubbleAwsSecretsAdded(currentSecrets);

    if (nonBubbleAwsSecretsAlreadyAdded) {
      bubbleWarn("Looks like you already have AWS credentials saved in your Github repository! Not to worry, those can stay safe and sound where they are, but to provision your preview apps, we will create a new IAM user with the proper permissions. The credentials for this new user will be saved in your Github repository prepended with 'BUBBLE'.\n");
    }

    const bubbleAwsSecretsAdded = checkBubbleAwsSecretsAdded(currentSecrets);

    if (!bubbleAwsSecretsAdded) {
      bubbleBold('\nCreating AWS IAM User credentials and saving in your Github repository...\n');

      await wrapExecCmd(createUser(repo));

      bubbleSuccess("created", "IAM User: ");

      const accessKeyInfo = await wrapExecCmd(createAccessKey(repo));
      bubbleSuccess("created", "IAM User Access Key: ");
      const accessKeyInfoObj = JSON.parse(accessKeyInfo);
      const accessKeyId = accessKeyInfoObj["AccessKey"]["AccessKeyId"];
      const secretKey = accessKeyInfoObj["AccessKey"]["SecretAccessKey"];

      modifyConfig(repo);
      modifyCredentials(accessKeyId, secretKey, repo);
      bubbleSuccess("created", "AWS Command Line Profile: ")

      await wrapExecCmd(attachUserPolicy(userPolicyPath, repo));
      bubbleSuccess("saved", "IAM User Restrictions: ");

      const token = getGitHubToken();

      const secrets = {
        "BUBBLE_AWS_ACCESS_KEY_ID": accessKeyId,
        "BUBBLE_AWS_SECRET_ACCESS_KEY": secretKey,
        "BUBBLE_GITHUB_TOKEN": token,
      };

      await addGithubSecrets(secrets);
    } else {
      bubbleBold("Your Bubble-created AWS IAM user has already previously been created and saved in your Github repository!");
    }

    createWorkflowDir();
    copyGithubActions();

    bubbleBold(WAIT_FOR_DB_MSG);
    const randomDBJoke = randomJokeSetup('DB');
    setTimeout(async () => {
      bubbleBold(waitForJokeSetup(randomDBJoke));
    }, 2000);
    setTimeout(async () => {
      bubbleBold(waitForJokePunchline(randomDBJoke, 'DB'));
    }, 7000);
    setTimeout(async () => {
      bubbleBold(WAIT_FOR_DB_JOKE_DRUM);
    }, 8000);
    setTimeout(async () => {
      bubbleBold(waitForDBJokeCrickets());
    }, 10000);


    setTimeout(async () => {
      try {
        await wrapExecCmd(createDynamoTable(repo));
        bubbleBold(DB_CREATED_MSG);
        bubbleBold(INIT_FINISHED_MSG);
      } catch {
        bubbleBold(DB_NOT_CREATED_MSG);
      }
    }, 13000);
  } catch (err) {
    bubbleErr(`Couldn't finish initializing Bubble:\n${err}`);
  }
};

module.exports = { init };
