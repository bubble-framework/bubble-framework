import ora from 'ora';
import chalk from 'chalk';
import figlet from 'figlet';
import lolcatjs from 'lolcatjs';

const reset = '\x1b[0m';

export const bubbleWelcome = (text) => {
  console.log(chalk.bold.hex('#023a8c')(text));
};

export const bubbleGeneral = (text) => {
  console.log(chalk.bold.hex('#003d47')(text));
};

export const bubbleLoading = (text, opt) => {
  const hexCode = opt === 1 ? '#005b6b' : '#0357d2';

  const spinner = ora(chalk.bold.hex(hexCode)(text));
  spinner.color = 'cyan';
  return spinner;
};

export const bubbleIntro = (text, opt) => {
  const hexCode = opt === 1 ? '#003d47' : '#023a8c';

  console.log(chalk.bold.hex(hexCode)(text));
};

export const bubbleSetup = (text, opt) => {
  const hexCode = opt === 1 ? '#005b6b' : '#0357d2';

  console.log(chalk.bold.hex(hexCode)(text));
};

export const bubblePunchline = (text, opt) => {
  const hexCode = opt === 1 ? '#007a8e' : '#2279fb';

  console.log(chalk.bold.hex(hexCode)(text));
};

export const bubbleConclusionPrimary = (text, opt) => {
  const hexCode = opt === 1 ? '#0093b5' : '#458ffb';

  console.log(chalk.bold.hex(hexCode)(text));
};

export const bubbleConclusionSecondary = (text, opt) => {
  const hexCode = opt === 1 ? '#0098b2' : '#68a4fc';

  console.log(chalk.bold.hex(hexCode)(text));
};

export const bubbleHelp = (text) => {
  console.log(chalk.bold.hex('#0357d2')(text));
};

export const bubbleSuccess = (successText, text) => {
  console.log(chalk.hex('#003d47')(text), chalk.hex('#0098b2')(successText), reset);
};

export const bubbleErr = (text) => {
  console.log(chalk.bold.hex('#eb0000')('Error: '), chalk.hex('#ff7676')(text), reset);
};

export const bubbleWarn = (text) => {
  console.log(chalk.bold.hex('#ffa500')(text));
};

export const bubbleSecrets = (text) => {
  console.log(chalk.hex('#00d6f9')(text));
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

export const asciiLogo = async () => {
  figlet.text('Bubble', {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 100,
    whitespaceBreak: true
  }, function(err, data) {
    if (err) {
      return err;
    }
    lolcatjs.options.animate = true;
    lolcatjs.options.speed = 10;
    lolcatjs.options.seed = 1900;
    lolcatjs.options.freq = 0.2;
    lolcatjs.fromString(data);
  });
  await sleep(5000);
};
