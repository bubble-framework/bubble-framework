const emoji = require('node-emoji');

const GITHUB_CONNECTION_FAILURE_MSG = `Please validate your Github token, git remote value, remote repo permissions, and make sure you set your remote repo URL to HTTPS (https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories#switching-remote-urls-from-ssh-to-https)\n`;
const INIT_FINISHED_MSG = `You're all set! Make sure your newly added \`.github/workflows\` folder is pushed to your Github repo's \`main\` branch. With any new pull requests made from another branch, we'll wave our magic bubble wands and start blowin' some bubbles! ${emoji.get('magic_wand')}`;

const WAIT_FOR_DB_MSG = "Each bubble will be created with its very own special set of AWS resources. In preparation to keep track of all your bubbles, we'll spin up a DynamoDB table right now with your brand new IAM user credentials. Hang tight while we get one created! In the meantime...\n";
const WAIT_FOR_DB_JOKE_DRUM = `${emoji.get('drum_with_drumsticks')}...\n`;
const DB_CREATED_MSG = "Whew! Good thing your DynamoDB table's created. We were about to tell another joke...\n";
const DB_NOT_CREATED_MSG = `Oh no, looks like there was an issue creating your DynamoDB table! ${emoji.get('face_with_hand_over_mouth')} Thank goodness for bubble wrap though, we've got you covered! Just re-run \`bubble init\` and we'll get that sorted out for you!`;

const WAIT_TO_DESTROY_MSG = `We'll get started popping all your bubbles! Grab a hot tea ${emoji.get('tea')} and chew on this bubble-related pun while you wait...\n"`;
const DESTROY_DONE_MSG = "All set! All Bubble-related files in your local project folder should now be deleted, and most AWS resources provisioned for your bubbles have been removed.\n";
const FOLDER_ALREADY_DELETED = `Looks like your local Bubble-related workflow files have already been deleted! We love an easy cleanup... ${emoji.get('broom')}`;

const WAIT_TO_TEARDOWN_MSG = `Let's get this bubble bath drained! ${emoji.get('bathtub')} Hope you haven't gotten tired of our jokes yet...\n"`;
const LAMBDA_TEARDOWN_ERROR_MSG = "We've got a real sudsy bubble bath on our hands! Unfortunately, some Lambdas are not ready to be deleted yet. Please wait at least a few hours before trying again!";
const TEARDOWN_DONE_MSG = `Woohoo! ${emoji.get('tada')} All remaining AWS resources provisioned for your bubbles have been removed, and any remaining traces of Bubble have been cleared out. It's like we were never here! As a final step, feel free to remove the \`.github/workflows\` folder from the \`main\` branch of your remote Github repo. See you during your next \`bubble init\`! ${emoji.get('hugging_face')}`;

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
  return `Oops! Could not finish executing \`bubble ${command}\`. Always make sure you're executing commands in the correct order: init, list/detail, destroy, teardown.`
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

  return `...${randomJokePunchline}\n`;
};

const waitForDBJokeCrickets = () => {
  const cricketEmoji = emoji.get('cricket');

  return `${cricketEmoji}${cricketEmoji}${cricketEmoji}...\n`;
};

const instructTeardown = (repo) => {
  const clockEmoji = emoji.get('mantelpiece_clock');
  const sudsEmoji = emoji.get('soap');

  return `Sometimes bubbles leave suds, however ${sudsEmoji} These remaining remnants live in your ${repo}-Lambdas DynamoDB table. To ensure these are removed, and to delete the IAM user we created for you during \`bubble init\`, follow up with the \`bubble teardown\` command in a day or two ${clockEmoji}\n`;
};

const dbDeletionError = (repo, name) => {
  return `Oops! Couldn't delete the ${repo}-${name} DynamoDB table.`;
};

module.exports = {
  GITHUB_CONNECTION_FAILURE_MSG,
  INIT_FINISHED_MSG,
  WAIT_FOR_DB_MSG,
  WAIT_FOR_DB_JOKE_DRUM,
  DB_CREATED_MSG,
  DB_NOT_CREATED_MSG,
  WAIT_TO_DESTROY_MSG,
  DESTROY_DONE_MSG,
  WAIT_TO_TEARDOWN_MSG,
  LAMBDA_TEARDOWN_ERROR_MSG,
  TEARDOWN_DONE_MSG,
  FOLDER_ALREADY_DELETED,
  commandsOutOfOrder,
  duplicateBubbleInit,
  randomJokeSetup,
  waitForJokeSetup,
  waitForJokePunchline,
  waitForDBJokeCrickets,
  instructTeardown,
  dbDeletionError,
};