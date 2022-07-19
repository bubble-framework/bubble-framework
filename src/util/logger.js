import ora from 'ora';
import chalk from 'chalk';

const reset = '\x1b[0m';

const bubbleWelcome = (text) => {
  console.log(chalk.bold.hex('#023a8c')(text));
};

const bubbleGeneral = (text) => {
  console.log(chalk.bold.hex('#003d47')(text));
};

const bubbleLoading = (text, opt) => {
  const hexCode = opt === 1 ? '#005b6b' : '#0357d2';

  const spinner = ora(chalk.bold.hex(hexCode)(text));
  spinner.color = 'cyan';
  return spinner;
};

const bubbleIntro = (text, opt) => {
  const hexCode = opt === 1 ? '#003d47' : '#023a8c';

  console.log(chalk.bold.hex(hexCode)(text));
};

const bubbleSetup = (text, opt) => {
  const hexCode = opt === 1 ? '#005b6b' : '#0357d2';

  console.log(chalk.bold.hex(hexCode)(text));
};

const bubblePunchline = (text, opt) => {
  const hexCode = opt === 1 ? '#007a8e' : '#2279fb';

  console.log(chalk.bold.hex(hexCode)(text));
};

const bubbleConclusionPrimary = (text, opt) => {
  const hexCode = opt === 1 ? '#0093b5' : '#458ffb';

  console.log(chalk.bold.hex(hexCode)(text));
};

const bubbleConclusionSecondary = (text, opt) => {
  const hexCode = opt === 1 ? '#0098b2' : '#68a4fc';

  console.log(chalk.bold.hex(hexCode)(text));
};

const bubbleHelp = (text) => {
  console.log(chalk.bold.hex('#0357d2')(text));
};

const bubbleSuccess = (successText, text) => {
  console.log(chalk.hex('#003d47')(text), chalk.hex('#0098b2')(successText), reset);
};

const bubbleErr = (text) => {
  console.log(chalk.bold.hex('#eb0000')('Error: '), chalk.hex('#ff7676')(text), reset);
};

const bubbleWarn = (text) => {
  console.log(chalk.bold.hex('#ffa500')(text));
};

const bubbleSecrets = (text) => {
  console.log(chalk.hex('#00d6f9')(text));
};

export default {
  bubbleSuccess,
  bubbleErr,
  bubbleHelp,
  bubbleGeneral,
  bubbleLoading,
  bubbleSecrets,
  bubbleWelcome,
  bubbleIntro,
  bubbleSetup,
  bubblePunchline,
  bubbleConclusionPrimary,
  bubbleConclusionSecondary,
  bubbleWarn,
};
