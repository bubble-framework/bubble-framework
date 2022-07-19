const emoji = require('node-emoji');

const NOT_A_REPO_MSG = `Please make sure the current directory is a git repository or is tied to a GitHub Origin, then re-run \`bubble init\`!`;
const WELCOME_MSG = `${emoji.get('large_blue_circle')} WELCOME TO THE BUBBLE CLI! ${emoji.get('large_blue_circle')}\n`;
const PREREQ_MSG = 'Before we get started, please make sure you have your AWS credentials configured with AWS CLI.\n';
const GITHUB_CONNECTION_FAILURE_MSG = `Please validate your Github token, git remote value, remote repo permissions, and make sure you set your remote repo URL to HTTPS (https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories#switching-remote-urls-from-ssh-to-https)\n`;
const GITHUB_PAT_MSG = `Please provide a valid github access token with 'repo' permission (https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) ${emoji.get('coin')}\nEnter token: `;
const REUSE_GH_PAT_MSG = `Would you like to use the same Github access token as the last time you ran \`bubble init\`?`;
const DASHBOARD_CLONE_MSG = "Getting your dashboard set up for easy viewing of all your bubbles...";
const DASHBOARD_INSTALL_MSG = `Nearly done with your dashboard! Just installing a few things ${emoji.get('wrench')} so we don't run into any bubble trouble later...`;
const NONBUBBLE_AWS_KEYS_IN_REPO_MSG = "Looks like you already have AWS credentials saved in your Github repository! Not to worry, those can stay safe and sound where they are, but to provision your preview apps, we will create a new IAM user with the proper permissions. The credentials for this new user will be saved in your Github repository prepended with 'BUBBLE'.\n";
const CREATING_IAM_USER_MSG = '\nCreating AWS IAM User credentials and saving in your Github repository...\n';
const BUBBLE_AWS_SECRETS_ALREADY_SAVED_MSG = "Your Bubble-created AWS IAM user has already previously been created and saved in your Github repository!";
const INIT_FINISHED_MSG = `You're all set! Make sure your newly added \`.github/workflows\` folder is pushed to your Github repo's \`main\` branch. With any new pull requests, we'll wave our magic bubble wands and start blowin' some bubbles! ${emoji.get('magic_wand')}`;

const WAIT_FOR_DB_MSG = "\nEach preview app bubble will be created with its very own special set of AWS resources. In preparation to keep track of all your bubbles, we'll spin up a DynamoDB table right now with your brand new IAM user credentials. Hang tight while we get one created! In the meantime...\n";
const WAIT_FOR_DB_JOKE_DRUM = `${emoji.get('drum_with_drumsticks')}...\n`;
const DB_CREATED_MSG = "Whew! Good thing your DynamoDB table's created. We were about to tell another joke...\n";
const DB_NOT_CREATED_MSG = `Oh no, looks like there was an issue creating your DynamoDB table! ${emoji.get('face_with_hand_over_mouth')} Thank goodness for bubble wrap though, we've got you covered! Just make sure the PreviewApps table for this repo does not already exist, re-run \`bubble init\`, and we'll get that sorted out for you!`;

const DETAIL_INTRO_MSG = "Here's a quick view of all your preview app bubbles:";
const SHORT_NO_BUBBLES_MSG = "No bubbles yet!";
const NO_BUBBLES_MSG = `Bubble bath's empty! Looks like you don't have any preview app bubbles yet. Make a pull request to start fillin' up your tub! ${emoji.get('bathtub')}`;
const PREVIEWS_TABLE_DELETED_MSG = "Looks like your bubble-tracking DynamoDB table hasn't been set up yet, or has already been destroyed. Try running \`bubble init\`.";
const NO_PREVIEW_DETAILS_RETRIEVED_MSG = "Sorry, we couldn't get the details for your bubbles!";

const DASHBOARD_STARTUP_MSG = "Bubblin' up your dashboard...\n";

const WAIT_TO_DESTROY_MSG = `We'll get started popping all active bubbles in your repo! Grab a bubble tea ${emoji.get('bubble_tea')} and chew on this bubble-related pun while you wait...\n`;
const DESTROY_WORKFLOWS_COMPLETING_MSG = "\nAll Bubble-related files in your local project folder should now be deleted, and AWS resources provisioned for your bubbles are well on their way to being fully removed.\n";
const FOLDER_ALREADY_DELETED = `Looks like your local Bubble-related workflow files were already deleted! We love an easy cleanup... ${emoji.get('broom')}`;

const WAIT_TO_TEARDOWN_MSG = `Let's get this bubble bath drained! ${emoji.get('bathtub')} Hope you haven't gotten tired of our jokes yet...\n`;
const DELETING_BUBBLE_USER_MSG = `Deleting the Bubble-created IAM user and its Gihub secrets...`;
const NONEXISTENT_BUBBLE_AWS_USER_MSG = "Looks like no Bubble-created IAM user exists for this repo!";
const LAMBDA_TEARDOWN_ERROR_MSG = "We've got a real sudsy bubble bath on our hands! Unfortunately, some Lambdas are not ready to be deleted yet. Please wait at least a few hours before trying again!";
const TEARDOWN_DONE_MSG = `\nWoohoo! ${emoji.get('tada')} All remaining AWS resources provisioned for your bubbles have been removed, and any remaining traces of Bubble have been cleared out. It's like we were never here! ${emoji.get('ghost')} As a final step, feel free to remove the \`.github/workflows\` folder from the \`main\` branch of your remote Github repo. See you during your next \`bubble init\`! ${emoji.get('hugging_face')}`;

const DB_WAIT_JOKES = {
  "Why do database programmers make good accomplices?": "Because they'll SQL, but not to the cops",
  "What is a database programmer’s favorite drink?": "Da-Queries",
  "Why did the database administrator leave his wife?": "She had one-to-many relationships",
};

const LAMBDA_WAIT_JOKES = {
  "Why did the French art dealer change careers to become an AWS reseller?": "To make all that Claude Monet",
  "Why did the programmer quit his job?": "Because he didn’t get arrays",
  "What's the object-oriented way to become wealthy?": "Inheritance",
};

const BUBBLE_PUNS = {
  "What do you call James Bond taking a bath?": "Bubble 0-7",
  "What do you call a third-generation bubble bath?": "Grandsuds",
  "What do you say when you are inside a bubble?": "Wow, unbelieve-bubble!",
};

const commandsOutOfOrder = (command) => {
  return `Oops! Couldn' finish executing \`bubble ${command}\`. Always make sure you're executing commands in the correct order: init, list/detail, dashboard/destroy, teardown ${emoji.get('wink')}`;
};

const duplicateBubbleInit = (repo) => {
  return `Looks like you already have an AWS IAM user named ${repo}-bubble-user! Have you already run \`bubble init\` previously? Only one execution of init is needed per repo ${emoji.get('wink')}`;
};

const determineJokeSource = (type) => {
  let source;

  switch (type) {
    case 'DB':
      source = DB_WAIT_JOKES;
      break;
    case 'DESTROY':
      source = BUBBLE_PUNS;
      break;
    case 'TEARDOWN':
      source = LAMBDA_WAIT_JOKES;
      break;
    default:
      source = BUBBLE_PUNS;
  };

  return source;
};

const randomJokeSetup = (type) => {
  const source = determineJokeSource(type);
  const jokeSetups = Object.keys(source);
  const randomIdx = Math.floor(Math.random() * jokeSetups.length);
  const randomJokeSetup = jokeSetups[randomIdx];

  return randomJokeSetup;
};

const waitForJokeSetup = (randomJokeSetup) => {
  return `${randomJokeSetup}...\n`;
};

const waitForJokePunchline = (randomJokeSetup, type) => {
  const source = determineJokeSource(type);
  const randomJokePunchline = source[randomJokeSetup];

  return `...${randomJokePunchline} ${emoji.get('joy')}\n`;
};

const waitForDBJokeCrickets = () => {
  const cricketEmoji = emoji.get('cricket');

  return `${cricketEmoji}${cricketEmoji}${cricketEmoji}...\n`;
};

const dashboardUrlMessage = (repo) => {
  return `Your dashboard is live at http://localhost:3000/${repo}! Cmd/Ctrl + bubble-click on the url and hop aboard this chew chew train ${emoji.get('train')} to check out all the bubbles we've blown up for ya!\nWhen you're done with the dashboard, just hit Ctrl+C to exit. Enjoy! ${emoji.get('wave')}`;
}

const instructTeardown = (repo) => {
  const clockEmoji = emoji.get('mantelpiece_clock');
  const sudsEmoji = emoji.get('soap');

  return `Sometimes bubbles leave suds, however ${sudsEmoji} These remaining remnants live in your ${repo}-Lambdas DynamoDB table. To ensure these are removed, and to delete the IAM user we created for you during \`bubble init\`, follow up with the \`bubble teardown\` command in a day or two ${clockEmoji}\n`;
};

const dbDeletionError = (repo, name) => {
  return `Oops! Couldn't delete the ${repo}-${name} DynamoDB table.`;
};

module.exports = {
  NOT_A_REPO_MSG,
  WELCOME_MSG,
  PREREQ_MSG,
  GITHUB_CONNECTION_FAILURE_MSG,
  GITHUB_PAT_MSG,
  REUSE_GH_PAT_MSG,
  DASHBOARD_CLONE_MSG,
  DASHBOARD_INSTALL_MSG,
  NONBUBBLE_AWS_KEYS_IN_REPO_MSG,
  CREATING_IAM_USER_MSG,
  BUBBLE_AWS_SECRETS_ALREADY_SAVED_MSG,
  INIT_FINISHED_MSG,
  WAIT_FOR_DB_MSG,
  WAIT_FOR_DB_JOKE_DRUM,
  DB_CREATED_MSG,
  DB_NOT_CREATED_MSG,
  DETAIL_INTRO_MSG,
  SHORT_NO_BUBBLES_MSG,
  NO_BUBBLES_MSG,
  PREVIEWS_TABLE_DELETED_MSG,
  NO_PREVIEW_DETAILS_RETRIEVED_MSG,
  DASHBOARD_STARTUP_MSG,
  WAIT_TO_DESTROY_MSG,
  DESTROY_WORKFLOWS_COMPLETING_MSG,
  WAIT_TO_TEARDOWN_MSG,
  DELETING_BUBBLE_USER_MSG,
  NONEXISTENT_BUBBLE_AWS_USER_MSG,
  LAMBDA_TEARDOWN_ERROR_MSG,
  TEARDOWN_DONE_MSG,
  FOLDER_ALREADY_DELETED,
  commandsOutOfOrder,
  duplicateBubbleInit,
  randomJokeSetup,
  waitForJokeSetup,
  waitForJokePunchline,
  waitForDBJokeCrickets,
  dashboardUrlMessage,
  instructTeardown,
  dbDeletionError,
};